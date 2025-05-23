"use client";

import { useApi } from "@/lib/api-client";
import { useParams } from "next/navigation";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "stale" | "completed" | "in-progress";
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

export default function TaskList() {
  const params = useParams();
  const todoId = params?.id as string;
  const api = useApi();
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<string[]>([]);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks", todoId],
    queryFn: async () => {
      const res = await api.get(`/todos/${todoId}/tasks`);
      return res.data;
    },
    enabled: !!todoId,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (task: {
      title: string;
      description: string;
      priority: "low" | "medium" | "high";
      dueDate?: Date;
    }) => {
      await api.post(`/todos/${todoId}/tasks`, {
        ...task,
        status: "in-progress",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", todoId] });
      toast.success("Task created");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/todos/${todoId}/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", todoId] });
      toast.success("Task deleted");
    },
  });

  const markCompletedMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/todos/${todoId}/tasks/${id}`, { status: "completed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", todoId] });
      toast.success("Task marked completed");
    },
  });

  const handleCreate = async (task: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate?: Date;
  }) => {
    await createTaskMutation.mutateAsync(task);
  };

  const handleDeleteSelected = async () => {
    await Promise.all(selected.map((id) => deleteTaskMutation.mutateAsync(id)));
    setSelected([]);
  };

  const handleMarkCompleted = async () => {
    await Promise.all(
      selected.map((id) => markCompletedMutation.mutateAsync(id))
    );
    setSelected([]);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <TaskModal onSubmit={handleCreate} />
      </div>

      {selected.length > 1 && (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleMarkCompleted}>
            Mark Completed
          </Button>
          <Button variant="destructive" onClick={handleDeleteSelected}>
            Delete Selected
          </Button>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              selected={selected.includes(task._id)}
              onToggle={() => toggleSelect(task._id)}
              showControls={selected.includes(task._id) && selected.length === 1}
              onDelete={() => deleteTaskMutation.mutateAsync(task._id)}
              onMarkComplete={() => markCompletedMutation.mutateAsync(task._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No Tasks Available</p>
      )}

      <div className="mt-10 border-t pt-6">
        <h2 className="text-lg font-semibold mb-2">Collaborators</h2>
        <p className="text-sm text-muted-foreground">
          (Assign editors/viewers – coming soon)
        </p>
      </div>
    </div>
  );
}
