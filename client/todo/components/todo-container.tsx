"use client";
import { Card, CardContent } from "@/components/ui/card";
import TodoCard from "./todo-card";
import useGetTodos from "../api/use-get-todos";

import { format } from "date-fns";
import { useEditTodoDialog } from "../hooks/use-edit-todo-dialog";
import useDeleteTodo from "../api/use-delete-todo";
import useEditTodoState from "../api/use-edit-todo-state";
import { useState } from "react";

export default function TodoContainer() {
  const { onOpen } = useEditTodoDialog();

  const todosQuery = useGetTodos();
  const deleteTodoMutation = useDeleteTodo();
  const editTodoStateMutation = useEditTodoState();

  const isPending = deleteTodoMutation.isPending || editTodoStateMutation.isPending;

  return (
    <Card>
      <CardContent>
        {todosQuery.data?.map((todo) => {
          return (
            <TodoCard
              key={todo.id}
              title={todo.title}
              description={todo.description}
              categories={todo.categories}
              doneIn={format(todo.doneIn, "dd-MM-yyyy")}
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
      </CardContent>
    </Card>
  );
}
