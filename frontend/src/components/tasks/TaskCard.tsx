"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "../ui/button";

type Props = {
  task: {
    _id: string;
    title: string;
    description?: string;
    status: string;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
  };
  selected?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  onMarkComplete?: () => void;
  showControls?: boolean;
};

export function TaskCard({
  task,
  selected,
  onToggle,
  showControls,
  onDelete,
  onMarkComplete,
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
    <div className="border p-4 rounded flex justify-between items-start gap-4">
      <div className="flex items-start gap-3">
        {onToggle && <Checkbox checked={selected} onCheckedChange={onToggle} />}
        <div>
          <p className="font-medium">{task.title}</p>
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="text-xs mt-1 text-gray-500">
              Due: {format(new Date(task.dueDate), "dd MMM yyyy")}
            </p>
          )}
        </div>
      </div>

      <div className="text-right space-y-1">
        <span className="text-xs px-2 py-1 rounded border capitalize block w-fit">
          {task.status}
        </span>
        <span
          className={cn(
            "text-xs px-2 py-1 rounded border capitalize block w-fit",
            getPriorityColor(task.priority)
          )}
        >
          {task.priority}
        </span>
      </div>
      {showControls && (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onMarkComplete}>
            ✔️ Complete
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            🗑️ Delete
          </Button>
        </div>
      )}
    </div>
  );
}
