"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api-client";
import { useState } from "react";
import TodoCard from "./TodoCard";
import Link from "next/link";
import { toast } from "sonner";
import {useMultipleSocketRooms } from "@/lib/useSocket";
import { useAuthStore } from "@/lib/stores/auth";

export interface TodoApp {
  _id: string;
  name: string;
  role: "owner" | "editor" | "viewer";
}

export default function TodoList() {
  const api = useApi();
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery<TodoApp[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get("/todos");
      return res.data;
    },
  });
  const {user} = useAuthStore()
  useMultipleSocketRooms([user?._id!], {
    collaboratorUpdate: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    todoUpdate: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/todos/${id}`);
    },
    onSuccess: () => {
      toast.success("Todo deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete todo. Please try again."
      );
    },
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6 px-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Todo Apps</h1>
        <Button asChild>
          <Link href="/todos/create">+ New Todo App</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-muted-foreground">No todo apps yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {todos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              footer={
                <div className="flex gap-2 justify-end">
                  <Link href={`/todos/${todo._id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                    >
                      Open
                    </Button>
                  </Link>
                  {todo.role === "owner" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTodoMutation.mutate(todo._id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
