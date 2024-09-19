import { ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { api } from "../services/api";
import { useParams } from "react-router-dom";
import { useState } from "react";

type Params = { roomId: string };

type MessageProps = {
  id: string;
  text: string;
  reactions: number;
  answered?: boolean;
};

export default function Message({
  id: messageId,
  text,
  reactions,
  answered = false,
}: MessageProps) {
  const [hasReacted, setHasReacted] = useState(false);
  const { roomId } = useParams<Params>();

  if (!roomId) {
    throw new Error("Messages component must be used within a room page");
  }

  async function handleAddMessageReaction() {
    try {
      await api.rooms.addMessageReaction(roomId!, messageId);
      setHasReacted(true);
    } catch (error) {
      toast.error("Falha ao reagir a mensagem, tente novamente.");
    }
  }

  async function handleRemoveMessageReaction() {
    try {
      await api.rooms.addMessageReaction(roomId!, messageId);
      setHasReacted(false);
    } catch (error) {
      toast.error("Falha ao remover reação da mensagem, tente novamente.");
    }
  }

  return (
    <li
      data-answered={answered}
      className="xl-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none"
    >
      {text}
      {hasReacted ? (
        <button
          type="button"
          className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500"
          onClick={handleRemoveMessageReaction}
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({reactions})
        </button>
      ) : (
        <button
          type="button"
          className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300"
          onClick={handleAddMessageReaction}
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({reactions})
        </button>
      )}
    </li>
  );
}
