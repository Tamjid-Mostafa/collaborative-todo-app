import { getServerApi } from "@/lib/api-server";
import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import TodoList from "@/components/todos/TodoList";

export default async function TodoAppsPage() {
  const api = await getServerApi();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await api.get("/todos");
      return res.data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodoList />
    </HydrationBoundary>
  );
}
