"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export default function useGetTodo(id?: string) {
  const query = useQuery({
    queryKey: ["todo", id],
    queryFn: async () => {
      const res = await client.api.todo[":id"].$get({ param: { id } });
      if (!res.ok) throw new Error("field to fetch accounts");

      const { data } = await res.json();
      return data;
    },
  });

  return query;
}