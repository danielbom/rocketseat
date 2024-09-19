import { ArrowRight } from "lucide-react";
import { api } from "../services/api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

type Params = { roomId: string };

export default function CreateMessageForm() {
  const { roomId } = useParams<Params>();

  if (!roomId) {
    throw new Error("Messages component must be used within a room page");
  }

  async function handleCreateQuestion(data: FormData) {
    const message = data.get("message") as string;

    if (!message) {
      return;
    }

    try {
      await api.rooms.createMessage(roomId!, { message });

      //   Query invalidation was done by the websocket implementation
      //   queryClient.invalidateQueries({
      //     queryKey: ["rooms", roomId, "messages"],
      //   });
    } catch (error) {
      toast.error("Falha ao enviar pergunta, tente novamente!");
    }
  }

  return (
    <form
      action={handleCreateQuestion}
      className="flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 ring-orange-400 ring-offset-2 ring-offset-zinc-900 focus-within:ring-1"
    >
      <input
        type="text"
        name="message"
        placeholder="Qual a sua pergunta?"
        autoComplete="off"
        className="flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500"
      />
      <button
        type="submit"
        className="bg-orange-400 text-orange-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-orange-500"
      >
        Criar pergunta
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
