import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Clock, Edit2, Trash2, X } from "lucide-react";

type props = {
  title: string;
  doneIn: string;
  description: string | null;
  categories: { id: string; name: string }[];
  state: string;
  onEdit: () => void;
  onDelete: () => void;
  noteIsCompleted: boolean;
  setNoteIsCompleted: () => void;
  isPending: boolean;
};

export default function NoteCard({ description, doneIn, state, title, categories, onEdit, onDelete, noteIsCompleted, setNoteIsCompleted, isPending }: props) {
  return (
    <div
      onClick={setNoteIsCompleted}
      className={cn("flex flex-col gap-2 justify-between bg-accent shadow-md rounded-lg p-3 min-w-[320px] min-h-[170px] cursor-pointer transition-colors duration-500 border hover:bg-accent-foreground", noteIsCompleted && "bg-[#272727] hover:bg-[#272727] hover:border-primary")}
    >
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground ">{title}</p>
        <div>
          <Button
            variant="ghost"
            className="hover:bg-slate-50/30"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            disabled={isPending}
            variant="ghost"
            className="hover:bg-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {noteIsCompleted ? <del className="text-lg py-2">{description || title}</del> : <h5 className="text-lg py-2">{description || title}</h5>}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map(
            (category) =>
              category && (
                <span className="bg-green-200/90 rounded-full py-[2px] px-[11px] text-xs text-green-900 font-semibold" key={category.id}>
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
