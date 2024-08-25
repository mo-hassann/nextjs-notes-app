"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export default function useGetNotes() {
  const query = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await client.api.note.$get();
      if (!res.ok) throw new Error("field to fetch accounts");

      const { data } = await res.json();
      return data;
    },
  });

  return query;
}
