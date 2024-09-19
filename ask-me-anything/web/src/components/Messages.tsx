import { useParams } from "react-router-dom";
import Message from "./Message";
import { api } from "../services/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import useMessageWebSocket from "../hooks/useMessagesWebSocket";

type Params = { roomId: string };

export default function Messages() {
  const { roomId } = useParams<Params>();

  if (!roomId) {
    throw new Error("Messages component must be used within a room page");
  }

  const { data } = useSuspenseQuery({
    queryFn: () => api.rooms.getMessages(roomId),
    queryKey: ["rooms", roomId, "messages"],
  });

  useMessageWebSocket(roomId);

  return (
    <ol className="list-decimal list-outside px-3 space-y-8">
      {data.messages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          reactions={message.reactions}
          text={message.text}
          answered={message.answered}
        />
      ))}
    </ol>
  );
}
