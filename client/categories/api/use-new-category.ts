import { client } from "@/lib/hono";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResType = InferResponseType<typeof client.api.category.$post>;
type ReqType = InferRequestType<typeof client.api.category.$post>["json"];

export default function useNewCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResType, Error, ReqType>({
    mutationFn: async (category) => {
      const res = await client.api.category.$post({ json: category });

      if (!res.ok) throw new Error("field to create categories");

      const data = await res.json();

      console.log(data);
      return data;
    },
    onSuccess: async (_, {}) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`category created successfully`);
    },
    onError: (error) => {
      console.log(error.message);
      toast.error(error.message || "something went wrong");
    },
  });

  return mutation;
}
