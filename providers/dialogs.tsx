import EditNoteDialog from "@/client/note/components/edit-note-dialog";
import NewNoteDialog from "@/client/note/components/new-note-dialog";
import React from "react";

export default function DialogsProvider() {
  return (
    <>
      <NewNoteDialog />
      <EditNoteDialog />
    </>
  );
}
