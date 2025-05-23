"use server";

import { getServerApi } from "@/lib/api-server";
import { revalidatePath } from "next/cache";

export async function createTask(todoId: string, formData: FormData) {
  const title = formData.get("title") as string;

  if (!title) return;

  const api = await getServerApi();
  await api.post(`/todos/${todoId}/tasks`, {
    title,
    status: "in-progress",
  });

  revalidatePath(`/todos/${todoId}`);
}
