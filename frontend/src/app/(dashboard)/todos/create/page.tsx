"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { api } from "@/lib/axios"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
})

export default function CreateToDoPage() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await api.post("/todos", data, { withCredentials: true })
      toast.success("Todo App created")
      router.push("/todos")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create")
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-20 border border-muted shadow-md">
      <CardHeader>
        <CardTitle>Create New Todo App</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
