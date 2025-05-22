"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { api } from "@/lib/axios"

const FormSchema = z.object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    username: z.string().min(2, { message: "Username is required" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be at least 6 chars" }),
  })
  

export default function SignUpForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
      },      
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await api.post("/auth/signup", data)
      console.log({res, "RESPONSE DATA":res.data});
      toast.success("Account created")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed")
    }
  }

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {["firstName", "lastName", "username", "email", "password"].map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as keyof z.infer<typeof FormSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name}</FormLabel>
                    <FormControl>
                      <Input
                        type={field.name === "password" ? "password" : "text"}
                        placeholder={field.name}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
