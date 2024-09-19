export type CreateRoomRequest = {
  theme: string;
};
export type CreateRoomResponse = {
  roomId: string;
};

export type CreateRoomMessageRequest = {
  message: string;
};
export type CreateRoomMessageResponse = {
  messageId: string;
};

export type RoomMessage = {
  id: string;
  text: string;
  reactions: number;
  answered: boolean;
};

export type GetRoomMessagesResponse = {
  messages: RoomMessage[];
};

export type RemoveMessageReactionResponse = {
  reactions: number;
};

type WsMessageCreated = {
  kind: "message_created";
  roomId: string;
  value: {
    id: string;
    message: string;
  };
};

type WsMessageReacted = {
  kind: "message_reacted";
  roomId: string;
  value: {
    id: string;
    reaction_count: number;
  };
};

type WsMessageAnswered = {
  kind: "message_answered";
  roomId: string;
  value: {
    id: string;
  };
};

export type WsData = WsMessageCreated | WsMessageReacted | WsMessageAnswered;

export class Config {
  constructor(public baseUrl: string) {}
}

class RoomsEndpoint {
  constructor(private config: Config) {}

  async create(body: CreateRoomRequest): Promise<CreateRoomResponse> {
    const response = await fetch(`${this.config.baseUrl}/api/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return { roomId: data.id };
  }

  async getMessages(roomId: string): Promise<GetRoomMessagesResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/rooms/${roomId}/messages`
    );

    type RoomMessage = {
      id: string;
      room_id: string;
      message: string;
      reaction_count: number;
      answered: boolean;
    };

    const data: RoomMessage[] = await response.json();

    return {
      messages: data.map((it) => ({
        id: it.id,
        text: it.message,
        reactions: it.reaction_count,
        answered: it.answered,
      })),
    };
  }

  async createMessage(
    roomId: string,
    body: CreateRoomMessageRequest
  ): Promise<CreateRoomMessageResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/rooms/${roomId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return { messageId: data.id };
  }

  async addMessageReaction(
    roomId: string,
    messageId: string
  ): Promise<RemoveMessageReactionResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/rooms/${roomId}/messages/${messageId}/react`,
      { method: "PATCH" }
    );

    const data = await response.json();

    return { reactions: data.reaction_count };
  }

  async removeMessageReaction(
    roomId: string,
    messageId: string
  ): Promise<RemoveMessageReactionResponse> {
    const response = await fetch(
      `${this.config.baseUrl}/api/rooms/${roomId}/messages/${messageId}/react`,
      { method: "DELETE" }
    );

    const data = await response.json();

    return { reactions: data.reaction_count };
  }
}

export default class Api {
  rooms: RoomsEndpoint;

  constructor(public config: Config) {
    this.rooms = new RoomsEndpoint(this.config);
  }

  wsSubscribeUrl(roomId: string): string {
    return `${this.config.baseUrl.replace(/https?/, "ws")}/subscribe/${roomId}`;
  }
}
