"use client";
import { Card, CardContent } from "@/components/ui/card";
import NoteCard from "./note-card";
import useGetNotes from "../api/use-get-notes";

import { format } from "date-fns";
import { useEditNoteDialog } from "../hooks/use-edit-note-dialog";
import useDeleteNote from "../api/use-delete-note";
import useEditNoteState from "../api/use-edit-note-state";
import { useState } from "react";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

export default function NoteContainer() {
  const { onOpen } = useEditNoteDialog();

  const notesQuery = useGetNotes();
  const deleteNoteMutation = useDeleteNote();
  const editNoteStateMutation = useEditNoteState();

  const isPending = deleteNoteMutation.isPending || editNoteStateMutation.isPending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {notesQuery.isLoading && <Spinner className="w-full col-span-full mt-12" />}
      {notesQuery.error && (
        <div className="flex items-center gap-3 flex-col w-full col-span-full mt-12 rounded-md">
          <div className="flex items-center gap-2 text-muted-foreground text-lg font-semibold">
            <CircleX className="size-8" />
            <span className="block">Something went wrong !</span>
          </div>
          <Button onClick={() => notesQuery.refetch()}>Try Again</Button>
        </div>
      )}
      {notesQuery.data?.length === 0 && <p className="text-center text-muted-foreground col-span-full">no notes here!</p>}
      {notesQuery.data
        ?.sort((note) => (note.state === "COMPLETED" ? 1 : 0))
        .map((note) => {
          return (
            <NoteCard
              key={note.id}
              title={note.title}
              description={note.description}
              categories={note.categories}
              doneIn={format(note.doneIn, "dd MMM")}
              state={note.state}
              onEdit={() => onOpen(note.id)}
              onDelete={() => deleteNoteMutation.mutate({ id: note.id })}
              setNoteIsCompleted={() =>
                editNoteStateMutation.mutate({
                  id: note.id,
                  state: note.state === "COMPLETED" ? "TODO" : "COMPLETED", // reverse the state (temporarily) // note make third option "INPROGRESS"
                })
              }
              noteIsCompleted={note.state === "COMPLETED"}
              isPending={isPending}
            />
          );
        })}
    </div>
  );
}
