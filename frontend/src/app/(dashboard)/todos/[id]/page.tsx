// app/todos/[id]/page.tsx
import TaskList from "@/components/tasks/TaskList";
import { getServerApi } from "@/lib/api-server";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const api = await getServerApi();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const res = await api.get(`/todos/${id}/tasks`);
      return res.data;
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <TaskList />
    </HydrationBoundary>
  );
}
