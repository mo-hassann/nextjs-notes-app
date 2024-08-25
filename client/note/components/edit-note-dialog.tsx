"use client";

import useGetNotes from "../api/use-get-notes";
import useNewNote from "../api/use-new-note";
import { format } from "date-fns";
import useGetCategories from "@/client/categories/api/use-get-categories";
import useNewCategory from "@/client/categories/api/use-new-category";
import Spinner from "@/components/spinner";
import DialogComponent from "@/components/dialog";
import NoteForm from "./note-form";
import { useEditNoteDialog } from "../hooks/use-edit-note-dialog";
import useEditNote from "../api/use-edit-note";
import useGetNote from "../api/use-get-note";
import { useEffect } from "react";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditNoteDialog() {
  const { isOpen, onClose, id } = useEditNoteDialog();

  const noteQuery = useGetNote(id);
  const categoriesQuery = useGetCategories();

  const editNoteMutation = useEditNote();
  const categoryMutation = useNewCategory();

  const isPending = categoryMutation.isPending || editNoteMutation.isPending;
  const isLoading = categoriesQuery.isLoading || noteQuery.isLoading;

  const loadingError = noteQuery.error;

  useEffect(() => {
    if (isOpen === true) {
      noteQuery.refetch();
      categoriesQuery.refetch();
    }
  }, [isOpen, categoriesQuery, noteQuery]);

  const categoryToSelectOptions = (categories: { id: string; name: string }[]) => {
    return categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  };

  return (
    <DialogComponent title="crate new note" isOpen={isOpen} onOpenChange={onClose}>
      {isLoading && <Spinner className="w-full my-12" />}
      {loadingError && (
        <div className="flex items-center gap-3 flex-col w-full col-span-full my-12">
          <div className="flex items-center gap-2 text-muted-foreground text-lg font-semibold">
            <CircleX className="size-8" />
            <span className="block">Something went wrong !</span>
          </div>
          <Button onClick={() => noteQuery.refetch()}>Try Again</Button>
        </div>
      )}

      {!isLoading && !loadingError && (
        <NoteForm
          defaultValues={{
            categories: categoryToSelectOptions(noteQuery.data?.categories ?? []),
            description: noteQuery.data?.description ?? "",
            doneIn: new Date(noteQuery.data?.doneIn ?? ""),
            title: noteQuery.data?.title ?? "",
          }}
          onSubmit={(data) =>
            editNoteMutation.mutate(
              {
                ...data,
                id: id as string,
                categoryIds: (data.categories ?? []).map((category) => category.value),
              },
              { onSuccess: () => onClose() }
            )
          }
          categories={categoryToSelectOptions(categoriesQuery.data ?? [])}
          onCreateOption={(inputValue) => categoryMutation.mutate({ name: inputValue })}
          disabled={isPending}
        />
      )}
    </DialogComponent>
  );
}
