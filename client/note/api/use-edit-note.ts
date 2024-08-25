import { client } from "@/lib/hono";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResType = InferResponseType<(typeof client.api.note)[":id"]["$patch"]>;
type ReqType = InferRequestType<(typeof client.api.note)[":id"]["$patch"]>["json"] & InferRequestType<(typeof client.api.note)[":id"]["$patch"]>["param"];

export default function useEditNote() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResType, Error, ReqType>({
    mutationFn: async (note) => {
      const res = await client.api.note[":id"].$patch({ json: note, param: { id: note.id } });

      if (!res.ok) throw new Error("field to create notes");

      const data = await res.json();

      return data;
    },
    onSuccess: async (_, {}) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`note created successfully`);
    },
    onError: (error) => {
      toast.error(error.message || "something went wrong");
    },
  });

  return mutation;
}
