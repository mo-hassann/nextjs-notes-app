import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, Edit2, Trash2, X } from "lucide-react";

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
    <div className="flex flex-col gap-2 justify-between bg-accent shadow-md rounded-lg p-3 min-w-[320px]">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground ">{title}</p>
        <div>
          <Button variant="ghost" className="hover:bg-slate-50/30" onClick={onEdit}>
            <Edit2 className="size-4" />
          </Button>
          <Button
            disabled={isPending}
            variant="ghost"
            className="hover:bg-destructive"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <h5 className="text-lg py-2">{description}</h5>

      <div className="flex flex-col gap-3">
        <div className="space-x-2">
          {categories.map(
            (category) =>
              category && (
                <span
                  className="bg-green-200/90 rounded-full py-[2px] px-[11px] text-xs text-green-900 font-semibold"
                  key={category.id}
                >
                  {category.name}
                </span>
              )
          )}
        </div>
        <div className="flex items-center gap-2 text-secondary text-xs place-self-end">
          <Clock className="size-4" />
          <p>{doneIn}</p>
        </div>
      </div>
    </div>
  );
}
