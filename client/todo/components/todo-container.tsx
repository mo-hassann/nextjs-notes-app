"use client";
import { Card, CardContent } from "@/components/ui/card";
import TodoCard from "./todo-card";
import useGetTodos from "../api/use-get-todos";

import { format } from "date-fns";
import { useEditTodoDialog } from "../hooks/use-edit-todo-dialog";

export default function TodoContainer() {
  const todosQuery = useGetTodos();
  const { onOpen } = useEditTodoDialog();

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
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
