"use client";

import useGetTodos from "../api/use-get-todos";
import useNewTodo from "../api/use-new-todo";
import { format } from "date-fns";
import useGetCategories from "@/client/categories/api/use-get-categories";
import useNewCategory from "@/client/categories/api/use-new-category";
import Spinner from "@/components/spinner";
import DialogComponent from "@/components/dialog";
import TodoForm from "./todo-form";
import { useNewTodoDialog } from "../hooks/use-new-todo-dialog";

export default function NewTodoDialog() {
  const { isOpen, onClose } = useNewTodoDialog();

  const categoriesQuery = useGetCategories();

  const newTodoMutation = useNewTodo();
  const categoryMutation = useNewCategory();

  const isPending = categoryMutation.isPending || newTodoMutation.isPending;
  const isLoading = categoriesQuery.isLoading;

  return (
    <DialogComponent title="crate new todo" isOpen={isOpen} onOpenChange={onClose}>
      {isLoading && <Spinner className="w-full my-12" />}
      {!isLoading && (
        <TodoForm
          defaultValues={{
            categories: [],
            description: "",
            doneIn: new Date(),
            title: "",
          }}
          onSubmit={(data) =>
            newTodoMutation.mutate(
              { ...data, categoryIds: (data.categories ?? []).map((category) => category.value) },
              { onSuccess: () => onClose() }
            )
          }
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
