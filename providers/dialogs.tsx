import EditTodoDialog from "@/client/todo/components/edit-todo-dialog";
import NewTodoDialog from "@/client/todo/components/new-todo-dialog";
import React from "react";

export default function DialogsProvider() {
  return (
    <>
      <NewTodoDialog />
      <EditTodoDialog />
    </>
  );
}
