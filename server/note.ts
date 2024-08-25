import db from "@/db";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { string, z } from "zod";
import { categoryTable, noteSchema, noteTable, noteToCategoryTable } from "@/db/schema";
import { getAuth } from "@hono/clerk-auth";
import { and, arrayContains, eq, inArray, sql } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);

    const data = await db
      .select({
        id: noteTable.id,
        title: noteTable.title,
        description: noteTable.description,
        state: noteTable.state,
        doneIn: noteTable.doneIn,
        categories: sql<{ id: string; name: string }[] | null | [null]>`json_agg(${categoryTable})`,
      })
      .from(noteTable)
      .leftJoin(noteToCategoryTable, eq(noteTable.id, noteToCategoryTable.noteId))
      .leftJoin(categoryTable, eq(noteToCategoryTable.categoryId, categoryTable.id))
      .where(eq(noteTable.userId, userId))
      .groupBy(noteTable.id)
      .then((notes) =>
        notes.map((note) => ({
          ...note,
          // some times this sql exception "json_agg" return ([null] or null) so this code ensure that the returning array always in the categories type
          categories: (note.categories ?? []).filter((item) => item !== null),
        }))
      );

    return c.json({ data });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string().min(1) })), async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);
    try {
      const { id: noteId } = c.req.valid("param");

      const [data] = await db
        .select({
          id: noteTable.id,
          title: noteTable.title,
          description: noteTable.description,
          state: noteTable.state,
          doneIn: noteTable.doneIn,
          categories: sql<{ id: string; name: string }[] | null | [null]>`json_agg(${categoryTable})`,
        })
        .from(noteTable)
        .leftJoin(noteToCategoryTable, eq(noteTable.id, noteToCategoryTable.noteId))
        .leftJoin(categoryTable, eq(noteToCategoryTable.categoryId, categoryTable.id))
        .where(and(eq(noteTable.userId, userId), eq(noteTable.id, noteId)))
        .groupBy(noteTable.id)
        .then((notes) =>
          notes.map((note) => ({
            ...note,
            // some times this sql exception "json_agg" return ([null] or null) so this code ensure that the returning array always in the categories type
            categories: (note.categories ?? []).filter((item) => item !== null),
          }))
        );

      if (!data) return c.json({ message: "note does not exist" }, 404);

      return c.json({ data });
    } catch (error: any) {
      console.log(error.message, "-------SERVER ERROR------");
      return c.json({ message: "server error" }, 400);
    }
  })
  .post(
    "/",
    zValidator(
      "json",
      noteSchema
        .pick({
          title: true,
          description: true,
          doneIn: true,
        })
        .and(z.object({ categoryIds: z.array(z.string()) }))
    ),
    async (c) => {
      const auth = getAuth(c);
      const userId = auth?.userId;
      if (!userId) return c.json({ message: "you are not logged in." }, 401);

      const values = c.req.valid("json");

      const [data] = await db
        .insert(noteTable)
        .values({ userId, ...values })
        .returning();

      if (values.categoryIds.length > 0) {
        const noteToCategoryValues = values.categoryIds.map((categoryId) => ({
          noteId: data.id,
          categoryId,
        }));

        await db.insert(noteToCategoryTable).values(noteToCategoryValues);
      }

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator(
      "json",
      noteSchema
        .pick({
          title: true,
          description: true,
          doneIn: true,
        })
        .and(z.object({ categoryIds: z.array(z.string()) }))
    ),
    zValidator("param", z.object({ id: z.string().min(1) })),
    async (c) => {
      const auth = getAuth(c);
      const userId = auth?.userId;
      if (!userId) return c.json({ message: "you are not logged in." }, 401);

      const values = c.req.valid("json");
      const { id: noteId } = c.req.valid("param");

      const [data] = await db
        .update(noteTable)
        .set(values)
        .where(and(eq(noteTable.id, noteId), eq(noteTable.userId, userId)))
        .returning();

      await db.delete(noteToCategoryTable).where(eq(noteToCategoryTable.noteId, data.id));

      if (values.categoryIds.length > 0) {
        const noteToCategoryValues = values.categoryIds.map((categoryId) => ({
          noteId: data.id,
          categoryId,
        }));

        await db.insert(noteToCategoryTable).values(noteToCategoryValues);
      }

      return c.json({ data });
    }
  )
  .patch("/:id/note-state", zValidator("json", noteSchema.pick({ state: true })), zValidator("param", z.object({ id: z.string().min(1) })), async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);

    const { state } = c.req.valid("json");
    const { id: noteId } = c.req.valid("param");

    const data = await db
      .update(noteTable)
      .set({ state })
      .where(and(eq(noteTable.id, noteId), eq(noteTable.userId, userId)));

    return c.json({ data });
  })
  .delete("/:id", zValidator("param", z.object({ id: z.string().min(1) })), async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);

    const { id: noteId } = c.req.valid("param");

    const [data] = await db
      .delete(noteTable)
      .where(and(eq(noteTable.id, noteId), eq(noteTable.userId, userId)))
      .returning();

    return c.json({ data });
  });

export default app;
