package api

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"
	"server/internal/store/pgstore"
	"sync"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/jackc/pgx/v5"
	"github.com/pkg/errors"
)

type apiHandler struct {
	q           *pgstore.Queries
	r           *chi.Mux
	upgrader    websocket.Upgrader
	subscribers map[string]map[*websocket.Conn]context.CancelFunc
	mu          *sync.RWMutex
}

const (
	ResponseMessageNotFound  = "message not found"
	ResponseMessagesNotFound = "messages not found"
	ResponseRoomNotFound     = "room not found"
	ResponseRoomsNotFound    = "rooms not found"
)

func (h *apiHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.r.ServeHTTP(w, r)
}

func NewHandler(q *pgstore.Queries) http.Handler {
	a := &apiHandler{
		q: q,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		subscribers: make(map[string]map[*websocket.Conn]context.CancelFunc),
		mu:          &sync.RWMutex{},
	}
	r := chi.NewRouter()
	a.r = r

	r.Use(middleware.RequestID, middleware.Recoverer, middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	r.Get("/subscribe/{room_id}", a.handleSubscribe)

	r.Route("/api", func(r chi.Router) {
		r.Route("/rooms", func(r chi.Router) {
			r.Post("/", a.handleCreateRoom)
			r.Get("/", a.handleGetRooms)

			r.Route("/{room_id}/messages", func(r chi.Router) {
				r.Post("/", a.handleCreateRoomMessage)
				r.Get("/", a.handleGetRoomMessages)

				r.Route("/{message_id}", func(r chi.Router) {
					r.Get("/", a.handleGetRoomMessage)
					r.Patch("/react", a.handleReactToMessage)
					r.Delete("/react", a.handleRemoveReactToMessage)
					r.Patch("/answer", a.handleMarkMessageAsAnswered)
				})
			})
		})
	})

	return a
}

const (
	MessageKindMessageCreated  = "message_created"
	MessageKindMessageReacted  = "message_reacted"
	MessageKindMessageAnswered = "message_answered"
)

type MessageMessageCreated struct {
	ID      string `json:"id"`
	Message string `json:"message"`
}

type MessageMessageReacted struct {
	ID            string `json:"id"`
	ReactionCount int64  `json:"reaction_count"`
}

type MessageMessageAnswered struct {
	ID string `json:"id"`
}

type Message struct {
	Kind   string `json:"kind"`
	Value  any    `json:"value"`
	RoomID string `json:"-"`
}

func (h apiHandler) notifyClients(msg Message) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	subscribers, ok := h.subscribers[msg.RoomID]
	if !ok || len(subscribers) == 0 {
		return
	}

	for conn, cancel := range subscribers {
		if err := conn.WriteJSON(msg); err != nil {
			slog.Warn("failed to send message to client", "error", err)
			cancel()
		}
	}
}

func (h apiHandler) handleSubscribe(w http.ResponseWriter, r *http.Request) {
	rawRoomID := chi.URLParam(r, "room_id")
	roomID, err := uuid.Parse(rawRoomID)

	if err != nil {
		http.Error(w, "invalid room id", http.StatusBadRequest)
		return
	}

	_, err = h.q.GetRoom(r.Context(), roomID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(w, "room not found", http.StatusNotFound)
			return
		}
		http.Error(w, "something went wrong", http.StatusInternalServerError)
		return
	}

	c, err := h.upgrader.Upgrade(w, r, nil)
	if err != nil {
		slog.Warn("failed to upgrade connection", "error", err)

		http.Error(w, "could not upgrade to ws connection", http.StatusBadRequest)
		return
	}
	defer c.Close()

	ctx, cancel := context.WithCancel(r.Context())

	h.mu.Lock()
	if _, ok := h.subscribers[rawRoomID]; !ok {
		h.subscribers[rawRoomID] = make(map[*websocket.Conn]context.CancelFunc)
	}
	h.subscribers[rawRoomID][c] = cancel
	h.mu.Unlock()

	slog.Info("new client connect", "room_id", rawRoomID, "client_ip", r.RemoteAddr)

	<-ctx.Done()

	h.mu.Lock()
	delete(h.subscribers[rawRoomID], c)
	if len(h.subscribers[rawRoomID]) == 0 {
		delete(h.subscribers, rawRoomID)
	}
	h.mu.Unlock()
}

func (h apiHandler) handleCreateRoom(w http.ResponseWriter, r *http.Request) {
	type _body struct {
		Theme string `json:"theme"`
	}
	var body _body
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if !_validateTheme(body.Theme) {
		http.Error(w, "invalid theme", http.StatusBadRequest)
		return
	}

	roomId, err := h.q.InsertRoom(r.Context(), body.Theme)
	if err != nil {
		slog.Error("failed to insert room", "error", err)
		http.Error(w, "something went wrong", http.StatusInternalServerError)
		return
	}

	type response struct {
		Id string `json:"id"`
	}

	data, _ := json.Marshal(response{Id: roomId.String()})

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(data)
}

func (h apiHandler) handleGetRooms(w http.ResponseWriter, r *http.Request) {
	rooms, err := h.q.GetRooms(r.Context())
	if err != nil {
		slog.Error("failed to get rooms", "error", err)
		http.Error(w, "something went wrong", http.StatusInternalServerError)
		return
	}

	type response struct {
		Id    string `json:"id"`
		Theme string `json:"theme"`
	}

	var res []response
	for _, room := range rooms {
		res = append(res, response{Id: room.ID.String(), Theme: room.Theme})
	}

	if res == nil {
		res = []response{}
	}

	data, _ := json.Marshal(res)

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(data)
}

func (h apiHandler) handleCreateRoomMessage(w http.ResponseWriter, r *http.Request) {
	rawRoomID := chi.URLParam(r, "room_id")
	roomID, ok := _parseUuidParam(w, rawRoomID, "room_id")
	if !ok {
		return
	}

	type _body struct {
		Message string `json:"message"`
	}

	var body _body
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if !_validateMessage(body.Message) {
		http.Error(w, "invalid message", http.StatusBadRequest)
		return
	}

	_, ok = _roomMustExist(w, r, h.q, roomID)
	if !ok {
		return
	}

	messageID, err := h.q.InsertMessage(r.Context(), pgstore.InsertMessageParams{RoomID: roomID, Message: body.Message})
	if err != nil {
		_queryWentWrong(w, err, ResponseMessageNotFound, "fail to insert message")
		return
	}
	rawMessageID := messageID.String()

	type response struct {
		Id string `json:"id"`
	}

	data, _ := json.Marshal(response{Id: rawMessageID})
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(data)

	go h.notifyClients(Message{
		Kind:   MessageKindMessageCreated,
		RoomID: rawRoomID,
		Value: MessageMessageCreated{
			ID:      rawMessageID,
			Message: body.Message,
		},
	})
}

func (h apiHandler) handleGetRoomMessages(w http.ResponseWriter, r *http.Request) {
	rawRoomID := chi.URLParam(r, "room_id")
	roomID, ok := _parseUuidParam(w, rawRoomID, "room_id")
	if !ok {
		return
	}

	_, ok = _roomMustExist(w, r, h.q, roomID)
	if !ok {
		return
	}

	messages, err := h.q.GetRoomMessages(r.Context(), roomID)
	if err != nil {
		_queryWentWrong(w, err, ResponseMessagesNotFound, "fail to get messages")
		return
	}

	type response struct {
		Id            string `json:"id"`
		RoomId        string `json:"room_id"`
		Message       string `json:"message"`
		ReactionCount int64  `json:"reaction_count"`
		Answered      bool   `json:"answered"`
	}

	var res []response
	for _, message := range messages {
		res = append(res, response{
			Id:            message.ID.String(),
			Message:       message.Message,
			RoomId:        rawRoomID,
			ReactionCount: message.ReactionCount,
			Answered:      message.Answered,
		})
	}

	if res == nil {
		res = []response{}
	}

	data, _ := json.Marshal(res)

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(data)
}

func (h apiHandler) handleGetRoomMessage(w http.ResponseWriter, r *http.Request) {
	rawMessageID := chi.URLParam(r, "message_id")
	messageID, ok := _parseUuidParam(w, rawMessageID, "message_id")
	if !ok {
		return
	}

	rawRoomID := chi.URLParam(r, "room_id")
	roomID, ok := _parseUuidParam(w, rawRoomID, "room_id")
	if !ok {
		return
	}

	_, ok = _roomMustExist(w, r, h.q, roomID)
	if !ok {
		return
	}

	message, err := h.q.GetMessage(r.Context(), messageID)
	if err != nil {
		_queryWentWrong(w, err, ResponseMessageNotFound, "fail to get message")
		return
	}

	type response struct {
		Id      string `json:"id"`
		Message string `json:"message"`
	}

	data, _ := json.Marshal(response{Id: message.ID.String(), Message: message.Message})

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(data)
}

func (h apiHandler) handleReactToMessage(w http.ResponseWriter, r *http.Request) {
	rawMessageID := chi.URLParam(r, "message_id")
	messageID, ok := _parseUuidParam(w, rawMessageID, "message_id")
	if !ok {
		return
	}

	rawRoomID := chi.URLParam(r, "room_id")
	roomID, ok := _parseUuidParam(w, rawRoomID, "room_id")
	if !ok {
		return
	}

	_, ok = _roomMustExist(w, r, h.q, roomID)
	if !ok {
		return
	}

	reactionCount, err := h.q.ReactToMessage(r.Context(), messageID)
	if err != nil {
		_queryWentWrong(w, err, ResponseMessageNotFound, "react to message")
		return
	}

	type response struct {
		ReactionCount int64 `json:"reaction_count"`
	}

	data, _ := json.Marshal(response{ReactionCount: reactionCount})

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(data)

	go h.notifyClients(Message{
		Kind:   MessageKindMessageReacted,
		RoomID: rawRoomID,
		Value: MessageMessageReacted{
			ID:            rawMessageID,
			ReactionCount: reactionCount,
		},
	})
}

func (h apiHandler) handleRemoveReactToMessage(w http.ResponseWriter, r *http.Request) {
	rawMessageID := chi.URLParam(r, "message_id")
	messageID, ok := _parseUuidParam(w, rawMessageID, "message_id")
	if !ok {
		return
	}

	rawRoomID := chi.URLParam(r, "room_id")
	roomID, ok := _parseUuidParam(w, rawRoomID, "room_id")
	if !ok {
		return
	}

	_, ok = _roomMustExist(w, r, h.q, roomID)
	if !ok {
		return
	}

	reactionCount, err := h.q.RemoveReactionFromMessage(r.Context(), messageID)
	if err != nil {
		_queryWentWrong(w, err, ResponseMessageNotFound, "remove message reaction")
		return
	}

	type response struct {
		ReactionCount int64 `json:"reaction_count"`
	}

	data, _ := json.Marshal(response{ReactionCount: reactionCount})

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(data)

	go h.notifyClients(Message{
		Kind:   MessageKindMessageReacted,
		RoomID: rawRoomID,
		Value: MessageMessageReacted{
			ID:            rawMessageID,
			ReactionCount: reactionCount,
		},
	})
}

func (h apiHandler) handleMarkMessageAsAnswered(w http.ResponseWriter, r *http.Request) {
	rawMessageID := chi.URLParam(r, "message_id")
	messageID, ok := _parseUuidParam(w, rawMessageID, "message_id")
	if !ok {
		return
	}

	rawRoomID := chi.URLParam(r, "room_id")
	roomID, ok := _parseUuidParam(w, rawRoomID, "room_id")
	if !ok {
		return
	}

	_, ok = _roomMustExist(w, r, h.q, roomID)
	if !ok {
		return
	}

	err := h.q.MarkMessageAsAnswered(r.Context(), messageID)
	if err != nil {
		_queryWentWrong(w, err, ResponseMessageNotFound, "mark message as answered")
		return
	}

	w.WriteHeader(http.StatusNoContent)

	go h.notifyClients(Message{
		Kind:   MessageKindMessageAnswered,
		RoomID: rawRoomID,
		Value: MessageMessageAnswered{
			ID: rawMessageID,
		},
	})
}

func _parseUuidParam(w http.ResponseWriter, rawID string, paramName string) (uuid.UUID, bool) {
	id, err := uuid.Parse(rawID)
	if err != nil {
		slog.Warn("invalid param: "+paramName, paramName, rawID)
		http.Error(w, "invalid uuid param: "+paramName, http.StatusBadRequest)
		return uuid.Nil, false
	}
	return id, true
}

func _roomMustExist(w http.ResponseWriter, r *http.Request, q *pgstore.Queries, id uuid.UUID) (pgstore.Room, bool) {
	room, err := q.GetRoom(r.Context(), id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			http.Error(w, "room not found", http.StatusNotFound)
			return pgstore.Room{}, false
		}
		http.Error(w, "something went wrong", http.StatusInternalServerError)
		return pgstore.Room{}, false
	}
	return room, true
}

func _queryWentWrong(w http.ResponseWriter, err error, notFoundMessage string, failMessage string) {
	if errors.Is(err, pgx.ErrNoRows) {
		http.Error(w, notFoundMessage, http.StatusNotFound)
		return
	}
	_somethingWentWrong(w, err, failMessage)
}

func _somethingWentWrong(w http.ResponseWriter, err error, msg string) {
	slog.Error(msg, "error", err)
	http.Error(w, "something went wrong", http.StatusInternalServerError)
}

func _validateTheme(theme string) bool {
	return len(theme) > 0
}

func _validateMessage(message string) bool {
	return len(message) > 0
}
