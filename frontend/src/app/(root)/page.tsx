import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 sm:p-20 bg-background text-foreground font-sans">
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">Collaborative ToDo</h1>
        <div className="space-x-4">
          <a href="/todos" className="underline hover:text-primary">My Todos</a>
          <a href="/sign-in" className="underline hover:text-primary">Sign In</a>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto flex flex-col justify-center items-center text-center gap-8">
        <h2 className="text-4xl font-semibold leading-tight">
          Organize tasks. Collaborate. Get things done.
        </h2>
        <p className="text-muted-foreground max-w-xl">
          Create shared todo apps, assign tasks, and stay productive with your team — all in one place.
        </p>
        <Link
          href="/sign-up"
          className="bg-primary text-white px-6 py-3 rounded-md shadow hover:bg-primary/90 transition"
        >
          Get Started
        </Link>
      </main>

      <footer className="w-full text-center text-sm text-muted-foreground pt-10">
        © {new Date().getFullYear()} Collaborative ToDo. All rights reserved.
      </footer>
    </div>
  );
}
