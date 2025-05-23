"use client";

import { useAuthStore } from "@/lib/stores/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { removeAuthCookie } from "@/lib/actions/auth/auth-cookies";

export default function Header() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    clearAuth();
    await removeAuthCookie();
    router.push("/sign-in");
  };

  return (
    <header className="w-full max-w-5xl mx-auto flex justify-between items-center py-4">
      <h1 className="text-3xl font-bold">Collaborative ToDo</h1>
      <div className="space-x-4">
        <Link href="/todos" className=" hover:text-primary">
          My ToDos
        </Link>

        {user ? (
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="cursor-pointer"
          >
            Sign Out
          </Button>
        ) : (
          <Link href="/sign-in" className=" hover:text-primary">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
