// components/TodoCard.tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import clsx from "clsx";

type TodoApp = {
  _id: string;
  name: string;
  role: "owner" | "editor" | "viewer";
};

interface TodoCardProps {
  todo: TodoApp;
  className?: string;
  footer?: React.ReactNode;
}

export default function TodoCard({ todo, className, footer }: TodoCardProps) {
  return (
    <Card className={clsx("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{todo.name}</span>
          <span className="text-xs text-muted-foreground capitalize">
            {todo.role}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>

      </CardContent>
      <CardFooter className="flex justify-end">
        {footer || (
          <Link href={`/todos/${todo._id}`}>
            <Button variant="outline" size="sm" className="cursor-pointer">
              Open
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
