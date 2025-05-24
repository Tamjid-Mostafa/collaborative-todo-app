"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Task } from "./TaskList";
import { StatusSelect } from "./StatusSelect";
import { PrioritySelect } from "./PrioritySelect";
import { Label } from "../ui/label";
import { Trash2 } from "lucide-react";

type Props = {
  task: Task;
  selected: boolean;
  onToggle?: () => void;
  showControls?: boolean;
  onDelete?: () => void;
  onStatusChange?: (status: Task["status"]) => void;
  onPriorityChange?: (priority: Task["priority"]) => void;
};

export function TaskCard({
  task,
  selected,
  onToggle,
  showControls,
  onDelete,
  onStatusChange,
  onPriorityChange,
}: Props) {
  const getPriorityColor = (level?: string) => {
    switch (level) {
      case "high":
        return "text-red-600 border-red-600";
      case "medium":
        return "text-yellow-600 border-yellow-600";
      case "low":
        return "text-green-600 border-green-600";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  return (
    <div className="border p-4 rounded space-y-4">
      <div className="flex items-start gap-3 w-full ">
        {onToggle && (
          <Checkbox
            checked={selected}
            onCheckedChange={onToggle}
            className="h-6 w-6"
          />
        )}
        <div className="flex-1 space-y-1 min-w-[150px]">
          <p className="font-medium text-base">{task.title}</p>

          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}

          {task.dueDate && (
            <p className="text-xs text-gray-500">
              Due: {format(new Date(task.dueDate), "dd MMM yyyy")}
            </p>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <Badge
            className={cn(
              "capitalize",
              task.status === "completed" && "bg-green-100 text-green-700",
              task.status === "in-progress" && "bg-yellow-100 text-yellow-800",
              task.status === "stale" && "bg-red-100 text-red-700"
            )}
          >
            {task.status}
          </Badge>
          <Badge
            variant="outline"
            className={cn(getPriorityColor(task.priority))}
          >
            {task.priority}
          </Badge>
        </div>
      </div>

      {showControls && (
        <div className="space-y-4 w-full">
          <div className="flex gap-2">
            <div className="flex justify-between gap-2 w-full">
              <Label>Status:</Label>
              <StatusSelect
                value={task.status}
                onChange={onStatusChange!}
                disabled={!showControls}
              />
            </div>
            <div className="flex justify-between gap-2 w-full">
              <Label>Priority:</Label>
              <PrioritySelect
                value={task.priority ?? "medium"}
                onChange={onPriorityChange!}
                disabled={!showControls}
              />{" "}
            </div>
          </div>

          <Button
            variant="destructive"
            size="icon"
            onClick={onDelete}
            disabled={!showControls}
            className="cursor-pointer"
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  );
}
