"use client";

import useGetNotes from "../api/use-get-notes";
import useNewNote from "../api/use-new-note";
import { format } from "date-fns";
import useGetCategories from "@/client/categories/api/use-get-categories";
import useNewCategory from "@/client/categories/api/use-new-category";
import Spinner from "@/components/spinner";
import DialogComponent from "@/components/dialog";
import NoteForm from "./note-form";
import { useNewNoteDialog } from "../hooks/use-new-note-dialog";

export default function NewNoteDialog() {
  const { isOpen, onClose } = useNewNoteDialog();

  const categoriesQuery = useGetCategories();

  const newNoteMutation = useNewNote();
  const categoryMutation = useNewCategory();

  const isPending = categoryMutation.isPending || newNoteMutation.isPending;
  const isLoading = categoriesQuery.isLoading;

  return (
    <DialogComponent title="crate new note" isOpen={isOpen} onOpenChange={onClose}>
      {isLoading && <Spinner className="w-full my-12" />}
      {!isLoading && (
        <NoteForm
          defaultValues={{
            categories: [],
            description: "",
            doneIn: new Date(),
            title: "",
          }}
          onSubmit={(data) => newNoteMutation.mutate({ ...data, categoryIds: (data.categories ?? []).map((category) => category.value) }, { onSuccess: () => onClose() })}
          categories={(categoriesQuery.data ?? []).map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          onCreateOption={(inputValue) => categoryMutation.mutate({ name: inputValue })}
          disabled={isPending}
        />
      )}
    </DialogComponent>
  );
}
