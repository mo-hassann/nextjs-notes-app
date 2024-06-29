"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export default function useGetCategories() {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await client.api.category.$get();
      if (!res.ok) throw new Error("field to fetch accounts");

      const { data } = await res.json();
      return data;
    },
  });

  return query;
}
