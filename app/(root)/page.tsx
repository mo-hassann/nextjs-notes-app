"use client";

import TodoContainer from "@/client/todo/components/todo-container";
import { useNewTodoDialog } from "@/client/todo/hooks/use-new-todo-dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { onOpen } = useNewTodoDialog();
  return (
    <section className="flex items-center justify-center h-full">
      <Button onClick={onOpen}>new todo</Button>
      <TodoContainer />
    </section>
  );
}
