"use client";

import NoteContainer from "@/client/note/components/note-container";
import { useNewNoteDialog } from "@/client/note/hooks/use-new-note-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SignInButton, useAuth } from "@clerk/nextjs";

export default function Home() {
  const { onOpen } = useNewNoteDialog();
  const { userId } = useAuth();
  return (
    <Card className="w-full min-h-[700px] mb-20">
      {userId ? (
        <>
          <CardHeader className="flex flex-row items-center justify-between">
            <h4 className="font-semibold text-lg">Your Notes</h4>
            <Button onClick={onOpen}>new note</Button>
          </CardHeader>
          <CardContent>
            <NoteContainer />
          </CardContent>
        </>
      ) : (
        <CardContent className="flex justify-center items-center flex-col gap-2">
          <h2 className="text-3xl mt-12 font-bold">Not Signed In</h2>
          <p className="text-muted-foreground">Sign in to crate, edit and view your notes.</p>
          <Button asChild>
            <SignInButton />
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
