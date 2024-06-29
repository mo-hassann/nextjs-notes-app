import { client } from "@/lib/hono";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResType = InferResponseType<(typeof client.api.todo)[":id"]["$patch"]>;
type ReqType = InferRequestType<(typeof client.api.todo)[":id"]["$patch"]>["json"] &
  InferRequestType<(typeof client.api.todo)[":id"]["$patch"]>["param"];

export default function useEditTodo() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResType, Error, ReqType>({
    mutationFn: async (todo) => {
      const res = await client.api.todo[":id"].$patch({ json: todo, param: { id: todo.id } });

      if (!res.ok) throw new Error("field to create todos");

      const data = await res.json();

      return data;
    },
    onSuccess: async (_, {}) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`todo created successfully`);
    },
    onError: (error) => {
      toast.error(error.message || "something went wrong");
    },
  });

  return mutation;
}
