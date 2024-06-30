"use client";
import { Card, CardContent } from "@/components/ui/card";
import TodoCard from "./todo-card";
import useGetTodos from "../api/use-get-todos";

import { format } from "date-fns";
import { useEditTodoDialog } from "../hooks/use-edit-todo-dialog";
import useDeleteTodo from "../api/use-delete-todo";
import useEditTodoState from "../api/use-edit-todo-state";
import { useState } from "react";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

export default function TodoContainer() {
  const { onOpen } = useEditTodoDialog();

  const todosQuery = useGetTodos();
  const deleteTodoMutation = useDeleteTodo();
  const editTodoStateMutation = useEditTodoState();

  const isPending = deleteTodoMutation.isPending || editTodoStateMutation.isPending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {todosQuery.isLoading && <Spinner className="w-full col-span-full mt-12" />}
      {todosQuery.error && (
        <div className="flex items-center gap-3 flex-col w-full col-span-full mt-12 rounded-md">
          <div className="flex items-center gap-2 text-muted-foreground text-lg font-semibold">
            <CircleX className="size-8" />
            <span className="block">Something went wrong !</span>
          </div>
          <Button onClick={() => todosQuery.refetch()}>Try Again</Button>
        </div>
      )}
      {todosQuery.data
        ?.sort((todo) => (todo.state === "COMPLETED" ? 1 : 0))
        .map((todo) => {
          return (
            <TodoCard
              key={todo.id}
              title={todo.title}
              description={todo.description}
              categories={todo.categories}
              doneIn={format(todo.doneIn, "dd MMM")}
              state={todo.state}
              onEdit={() => onOpen(todo.id)}
              onDelete={() => deleteTodoMutation.mutate({ id: todo.id })}
              setTodoIsCompleted={() =>
                editTodoStateMutation.mutate({
                  id: todo.id,
                  state: todo.state === "COMPLETED" ? "TODO" : "COMPLETED", // reverse the state (temporarily) // todo make third option "INPROGRESS"
                })
              }
              todoIsCompleted={todo.state === "COMPLETED"}
              isPending={isPending}
            />
          );
        })}
    </div>
  );
}
