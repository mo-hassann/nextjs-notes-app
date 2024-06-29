import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

type props = {
  title: string;
  doneIn: string;
  description: string | null;
  categories: { id: string; name: string }[];
  state: string;
  onEdit: () => void;
  onDelete: () => void;
  todoIsCompleted: boolean;
  setTodoIsCompleted: () => void;
  isPending: boolean;
};

export default function TodoCard({
  description,
  doneIn,
  state,
  title,
  categories,
  onEdit,
  onDelete,
  todoIsCompleted,
  setTodoIsCompleted,
  isPending,
}: props) {
  return (
    <Card>
      <CardContent>
        <Button onClick={onEdit}>edit</Button>
        <Button disabled={isPending} variant="destructive" onClick={onDelete}>
          delete
        </Button>
        <h4>{title}</h4>
        <p>{description}</p>
        <div className="space-x-2">
          {categories.length > 0 ? (
            categories.map(
              (category) =>
                category && (
                  <span className="bg-green-300 rounded-md p-1" key={category.id}>
                    {category.name}
                  </span>
                )
            )
          ) : (
            <span className="bg-rose-300 rounded-md p-1">no categories</span>
          )}
        </div>
        <p>{doneIn.toString()}</p>
        <p>{state}</p>

        <Button disabled={isPending} className="rounded-full" onClick={setTodoIsCompleted}>
          {todoIsCompleted ? <X /> : <Check />}
        </Button>
      </CardContent>
    </Card>
  );
}
