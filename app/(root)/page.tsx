"use client";

import TodoContainer from "@/client/todo/components/todo-container";
import { useNewTodoDialog } from "@/client/todo/hooks/use-new-todo-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Home() {
  const { onOpen } = useNewTodoDialog();
  return (
    <Card className="w-full min-h-[700px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <h4 className="font-semibold text-lg">Your Todos</h4>
        <Button onClick={onOpen}>new todo</Button>
      </CardHeader>
      <CardContent>
        <TodoContainer />
      </CardContent>
    </Card>
  );
}
