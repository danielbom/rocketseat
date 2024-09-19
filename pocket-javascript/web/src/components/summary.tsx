import dayjs from "dayjs";
import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { InOrbitIcon } from "./in-orbit-icon";
import { OutlineButton } from "./ui/outline-button";
import { getSummary } from "../http/get-summary";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingGoals } from "../http/get-pending-goals";
import { createGoalCompletion } from "../http/create-goal-completion";

export function Summary() {
  const queryClient = useQueryClient();

  const { data: summary } = useQuery({
    queryKey: ["getSummary"],
    queryFn: () => getSummary(),
    staleTime: 1000,
  });

  const { data: pendingGoals } = useQuery({
    queryKey: ["getPendingGoals"],
    queryFn: () => getPendingGoals(),
    staleTime: 1000,
  });

  const completedPercentage = summary
    ? ((100 * summary.completed) / summary.total).toFixed(1)
    : 0;
  const firstDayOfWeek = dayjs().startOf("week").format("D MMM");
  const lastDayOfWeek = dayjs().endOf("week").format("D MMM");

  async function handleCompleteGoal(goalId: string) {
    await createGoalCompletion(goalId);
    queryClient.invalidateQueries({ queryKey: ["getPendingGoals"] });
    queryClient.invalidateQueries({ queryKey: ["getSummary"] });
  }

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{" "}
            <span className="text-zinc-100">{summary?.completed}</span> de{" "}
            <span className="text-zinc-100">{summary?.total}</span> metas nessa
            semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap gap-3">
        {pendingGoals?.map((it, index) => (
          <OutlineButton
            key={it.id + index.toString()}
            disabled={it.completionCount >= it.desiredWeeklyFrequency}
            onClick={() => handleCompleteGoal(it.id)}
          >
            <Plus className="size-4 text-zinc-600" />
            {it.title}
          </OutlineButton>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>

        {Object.entries(summary?.goalsPerDay ?? {}).map(([day, goals]) => {
          const date = dayjs(day);

          return (
            <div key={day} className="flex flex-col gap-4">
              <h3 className="font-medium">
                <span className="capitalize">{date.format("dddd")}</span>{" "}
                <span className="text-zinc-400 text-xs">
                  ({date.format("DD [de] MMMM")})
                </span>
              </h3>

              <ul className="flex flex-col gap-3">
                {goals.map((goal) => (
                  <li key={goal.id} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-pink-500" />
                    <span className="text-sm text-zinc-400">
                      Você completou "
                      <span className="text-zinc-100">{goal.title}</span>" às{" "}
                      <span className="text-zinc-100">
                        {dayjs(goal.completedAt).format("HH:ss[h]")}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
