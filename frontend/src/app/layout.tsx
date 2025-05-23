import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/home/header";
import ReactQueryProvider from "./providers";

export const metadata: Metadata = {
  title: "Collaborative ToDo App",
  description: "Developed by Tamjid Mostafa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <main className="container mx-auto md:px-10 px-5">
            <Header />
            {children}
          </main>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
