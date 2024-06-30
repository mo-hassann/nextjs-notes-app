"use client";

import useGetTodos from "../api/use-get-todos";
import useNewTodo from "../api/use-new-todo";
import { format } from "date-fns";
import useGetCategories from "@/client/categories/api/use-get-categories";
import useNewCategory from "@/client/categories/api/use-new-category";
import Spinner from "@/components/spinner";
import DialogComponent from "@/components/dialog";
import TodoForm from "./todo-form";
import { useEditTodoDialog } from "../hooks/use-edit-todo-dialog";
import useEditTodo from "../api/use-edit-todo";
import useGetTodo from "../api/use-get-todo";
import { useEffect } from "react";

export default function EditTodoDialog() {
  const { isOpen, onClose, id } = useEditTodoDialog();

  const todoQuery = useGetTodo(id);
  const categoriesQuery = useGetCategories();

  const editTodoMutation = useEditTodo();
  const categoryMutation = useNewCategory();

  const isPending = categoryMutation.isPending || editTodoMutation.isPending;
  const isLoading = categoriesQuery.isLoading || todoQuery.isLoading;

  const loadingError = todoQuery.error;

  useEffect(() => {
    if (isOpen === true) {
      todoQuery.refetch();
      categoriesQuery.refetch();
    }
  }, [isOpen, categoriesQuery, todoQuery]);

  const categoryToSelectOptions = (categories: { id: string; name: string }[]) => {
    return categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  };

  return (
    <DialogComponent title="crate new todo" isOpen={isOpen} onOpenChange={onClose}>
      {isLoading ? (
        <Spinner />
      ) : loadingError ? (
        <p>something went wrong</p>
      ) : (
        <TodoForm
          defaultValues={{
            categories: categoryToSelectOptions(todoQuery.data?.categories ?? []),
            description: todoQuery.data?.description ?? "",
            doneIn: new Date(todoQuery.data?.doneIn ?? ""),
            title: todoQuery.data?.title ?? "",
          }}
          onSubmit={(data) =>
            editTodoMutation.mutate(
              {
                ...data,
                id,
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
