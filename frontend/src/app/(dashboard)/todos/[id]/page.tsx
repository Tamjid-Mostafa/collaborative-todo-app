"use client";

import { useApi } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  status: "stale" | "completed" | "in-progress";
}

export default function TaskListPage() {
  const params = useParams();
  const todoId = params?.id as string;

  const api = useApi();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await api.get(`/todos/${todoId}/tasks`);
    console.log(res.data);
    setTasks(res.data);
  };

  const handleCreateTask = async () => {
    if (!title.trim()) return;
    await api.post(`/todos/${todoId}/tasks`, {
      title,
      status: "in-progress",
    });
    setTitle("");
    setOpen(false);
    fetchTasks();
  };

  useEffect(() => {
    if (todoId) fetchTasks();
  }, [todoId]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Create Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Task</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <DialogFooter>
              <Button onClick={handleCreateTask} className="cursor-pointer">
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {tasks?.length > 0 ? (
        <ul className="space-y-2">
          {tasks?.map((task) => (
            <li
              key={task._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <span>{task.title}</span>
              <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground capitalize">
                {task.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div>No Tasks Available</div>
      )}
    </div>
  );
}
