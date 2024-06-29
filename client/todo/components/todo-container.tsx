"use client";
import { Card, CardContent } from "@/components/ui/card";
import TodoCard from "./todo-card";
import NewTodoForm from "./new-todo-form";
import DialogComponent from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useGetTodos from "../api/use-get-todos";
import useNewTodo from "../api/use-new-todo";
import { format } from "date-fns";
import useGetCategories from "@/client/categories/api/use-get-categories";
import useNewCategory from "@/client/categories/api/use-new-category";
import Spinner from "@/components/spinner";

export default function TodoContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const todosQuery = useGetTodos();
  const newTodoMutation = useNewTodo();
  const categoriesQuery = useGetCategories();
  const categoryMutation = useNewCategory();

  const isPending = categoryMutation.isPending || newTodoMutation.isPending;
  const isLoading = categoriesQuery.isLoading;

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>new todo</Button>
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
              />
            );
          })}
        </CardContent>
      </Card>
      <DialogComponent title="crate new todo" isOpen={isOpen} onOpenChange={() => setIsOpen(false)}>
        {isLoading ? (
          <Spinner />
        ) : (
          <NewTodoForm
            onSubmit={(data) =>
              newTodoMutation.mutate(
                { ...data, categoryIds: data.categories.map((category) => category.value) },
                { onSuccess: () => setIsOpen(false) }
              )
            }
            categories={categoriesQuery.data || []}
            onCreateOption={(inputValue) => categoryMutation.mutate({ name: inputValue })}
            disabled={isPending}
          />
        )}
      </DialogComponent>
    </>
  );
}
