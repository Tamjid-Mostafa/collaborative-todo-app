"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { setAuthCookie } from "@/lib/actions/auth/auth-cookies";
import { useAuthStore } from "@/lib/stores/auth";
import { useApi } from "@/lib/api-client";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignInPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setAuth } = useAuthStore();
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const api = useApi();
      const res = await api.post("/auth/login", data, {
        withCredentials: true,
      });
      const { access_token, user } = res.data;
      await setAuthCookie(access_token);
      setAuth(access_token, user);
      toast.success("Logged in successfully");
      router.push("/todos");
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <Card className="max-w-md w-full mx-auto mt-24 shadow-md border border-muted">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="********"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer"
                      >
                        {passwordVisible ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={loading}
              type="submit"
              className="w-full relative"
            >
              Sign In{" "}
              {loading && <Loader2 className="absolute right-4 animate-spin" />}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Don’t have an account?{" "}
              <Link href="/sign-up" className="text-primary underline">
                Sign up
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
