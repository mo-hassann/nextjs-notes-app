"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export default function useGetNote(id?: string) {
  const query = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await client.api.note[":id"].$get({ param: { id: id as string } });
      if (!res.ok) throw new Error("field to fetch accounts");

      const { data } = await res.json();
      return data;
    },
    enabled: !!id,
  });

  return query;
}
