import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api, GetRoomMessagesResponse, WsData } from "../services/api";

export default function useMessageWebSocket(roomId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(api.wsSubscribeUrl(roomId));

    ws.onopen = () => {
      console.log(`websocket connection open`);
    };

    ws.onclose = () => {
      console.log("websocket connection close");
    };

    ws.onmessage = (event: MessageEvent) => {
      // console.log("websocket message", event);
      const data = JSON.parse(event.data) as WsData;

      switch (data.kind) {
        case "message_created": {
          const queryKey = ["rooms", roomId, "messages"];
          queryClient.setQueryData<GetRoomMessagesResponse>(queryKey, (state) =>
            !state
              ? { messages: [] }
              : ({
                  messages: state.messages.concat([
                    {
                      id: data.value.id,
                      answered: false,
                      reactions: 0,
                      text: data.value.message,
                    },
                  ]),
                } as GetRoomMessagesResponse)
          );
          break;
        }
        case "message_reacted": {
          const queryKey = ["rooms", roomId, "messages"];
          queryClient.setQueryData<GetRoomMessagesResponse>(queryKey, (state) =>
            !state
              ? { messages: [] }
              : {
                  messages: state.messages.map((message) =>
                    message.id === data.value.id
                      ? { ...message, reactions: data.value.reaction_count }
                      : message
                  ),
                }
          );
          break;
        }
        case "message_answered": {
          const queryKey = ["rooms", roomId, "messages"];
          queryClient.setQueryData<GetRoomMessagesResponse>(queryKey, (state) =>
            !state
              ? { messages: [] }
              : {
                  messages: state.messages.map((message) =>
                    message.id === data.value.id
                      ? { ...message, answered: true }
                      : message
                  ),
                }
          );
          break;
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [queryClient, roomId]);
}
