import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerApi } from "@/lib/api-server";
import TodoCard from "@/components/todos/TodoCard";

type TodoApp = {
  _id: string;
  name: string;
  role: "owner" | "editor" | "viewer";
};

export default async function TodoAppsPage() {
  const api = await getServerApi();
  const res = await api.get("/todos");
  const todos = res.data;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6 px-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Todo Apps</h1>
        <Button asChild>
          <Link href="/todos/create">+ New Todo App</Link>
        </Button>
      </div>

      {todos?.length === 0 ? (
        <p className="text-muted-foreground">No todo apps yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {todos.map((todo: TodoApp) => (
            <TodoCard todo={todo} key={todo._id} />
          ))}
        </div>
      )}
    </div>
  );
}
