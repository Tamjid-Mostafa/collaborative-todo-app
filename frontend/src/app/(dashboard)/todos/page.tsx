"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type TodoApp = {
  _id: string
  name: string
  role: "owner" | "editor" | "viewer"
}

export default function TodoAppsPage() {
  const [todos, setTodos] = useState<TodoApp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTodos() {
      try {
        const res = await api.get("/todos", {withCredentials:true})
        console.log(res);
        setTodos(res.data)
      } catch (err) {
        console.error("Failed to load todos")
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, [])

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Todo Apps</h1>
        <Button asChild>
          <Link href="/todos/create">+ New Todo App</Link>
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : todos.length === 0 ? (
        <p className="text-muted-foreground">No todo apps yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {todos.map((todo) => (
            <Card key={todo._id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{todo.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {todo.role}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/todos/${todo._id}`}>
                  <Button variant="outline" size="sm">
                    Open
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
