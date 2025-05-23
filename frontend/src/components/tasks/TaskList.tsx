"use client";

import { useApi } from "@/lib/api-client";
import { useParams, useRouter } from "next/navigation";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StatusSelect } from "./StatusSelect";
import { PrioritySelect } from "./PrioritySelect";
import { ArrowLeftCircle, MoveLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { CollaboratorSection } from "./CollaboratorSection";
import { User } from "./types";
import { useSocketRoom } from "@/lib/useSocket";

export interface Task {
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
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  useSocketRoom(todoId, () => {
    queryClient.invalidateQueries({ queryKey: ["todo-details", todoId] });
  });
  


  const { data, isLoading } = useQuery<{
    tasks: Task[];
    todoApp: {
      _id: string;
      name: string;
      owner: User;
      editors: User[];
      viewers: User[];
    };
    role: "owner" | "editor" | "viewer";
  }>({
    queryKey: ["todo-details", todoId],
    queryFn: async () => {
      const res = await api.get(`/todos/${todoId}/details`);
      return res.data;
    },
    enabled: !!todoId,
  });
  const isEditorOrOwner = ["owner", "editor"].includes(data?.role ?? "");
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
      queryClient.invalidateQueries({ queryKey: ["todo-details", todoId] });
      toast.success("Task created");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/todos/${todoId}/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-details", todoId] });
      {
        selected.length < 2 && toast.success("Task deleted");
      }
    },
  });

  const markStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "in-progress" | "completed" | "stale";
    }) => {
      await api.patch(`/todos/${todoId}/tasks/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-details", todoId] });
      toast.success("Status updated");
    },
  });
  const markPriorityMutation = useMutation({
    mutationFn: async ({
      id,
      priority,
    }: {
      id: string;
      priority: Task["priority"];
    }) => {
      await api.patch(`/todos/${todoId}/tasks/${id}`, { priority });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-details", todoId] });
      {
        selected.length < 2 && toast.success("Priority updated");
      }
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
    toast.success("Selected tasks deleted");
    setSelected([]);
  };

  type MarkType = "status" | "priority";

  const handleMark = async (
    type: MarkType,
    value: Task["status"] | Task["priority"]
  ) => {
    switch (type) {
      case "status":
        await Promise.all(
          selected.map((id) =>
            markStatusMutation.mutateAsync({
              id,
              status: value as Task["status"],
            })
          )
        );
        toast.success("Status updated for selected tasks");
        break;

      case "priority":
        await Promise.all(
          selected.map((id) =>
            markPriorityMutation.mutateAsync({
              id,
              priority: value as Task["priority"],
            })
          )
        );
        toast.success("Priority updated for selected tasks");
        break;

      default:
        break;
    }

    // setSelected([]);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  console.log(data);
  
  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="inline cursor-pointer group"
          >
            <ArrowLeftCircle className="w-6 h-6 group-hover:scale-105 scale-100 transition duration-300" />
          </button>
          <h1 className="text-2xl font-bold">
            {data?.todoApp?.name || "Todo App"}{" "}
            <Badge
              variant="secondary"
              className="capitalize text-muted-foreground"
            >
              {data?.role}
            </Badge>
          </h1>
        </div>
        <TaskModal onSubmit={handleCreate} disabled={!isEditorOrOwner} />
      </div>

      {(selected.length > 1 && isEditorOrOwner) && (
        <div className="flex gap-2 justify-end items-center flex-wrap">
          <StatusSelect
            value="in-progress"
            onChange={(status) => handleMark("status", status)}
          />
          <PrioritySelect
            value="medium"
            onChange={(priority) => handleMark("priority", priority)}
          />

          <Button variant="destructive" onClick={handleDeleteSelected}>
            Delete Selected
          </Button>
        </div>
      )}

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading tasks...</p>
      ) : data?.tasks && data?.tasks?.length > 0 ? (
        <div className="space-y-3">
          {data.tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              selected={selected.includes(task._id)}
              onToggle={
                isEditorOrOwner ? () => toggleSelect(task._id) : undefined
              }
              showControls={
                isEditorOrOwner &&
                selected.includes(task._id) &&
                selected.length === 1
              }
              onDelete={() => deleteTaskMutation.mutateAsync(task._id)}
              onPriorityChange={(priority) =>
                markPriorityMutation.mutateAsync({ id: task._id, priority })
              }
              onStatusChange={(status) =>
                markStatusMutation.mutateAsync({ id: task._id, status })
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No Tasks Available</p>
      )}
      <CollaboratorSection
        todoId={todoId}
        canInvite={isEditorOrOwner}
        owner={data?.todoApp.owner}
        editors={data?.todoApp.editors}
        viewers={data?.todoApp.viewers}
      />
    </div>
  );
}
