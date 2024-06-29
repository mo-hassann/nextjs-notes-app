import db from "@/db";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { string, z } from "zod";
import { categoryTable, todoSchema, todoTable, todoToCategoryTable } from "@/db/schema";
import { getAuth } from "@hono/clerk-auth";
import { and, arrayContains, eq, inArray, sql } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);

    const data = await db
      .select({
        id: todoTable.id,
        title: todoTable.title,
        description: todoTable.description,
        state: todoTable.state,
        doneIn: todoTable.doneIn,
        categories: sql<{ id: string; name: string }[] | null | [null]>`json_agg(${categoryTable})`,
      })
      .from(todoTable)
      .leftJoin(todoToCategoryTable, eq(todoTable.id, todoToCategoryTable.todoId))
      .leftJoin(categoryTable, eq(todoToCategoryTable.categoryId, categoryTable.id))
      .where(eq(todoTable.userId, userId))
      .groupBy(todoTable.id)
      .then((todos) =>
        todos.map((todo) => ({
          ...todo,
          // some times this sql exception "json_agg" return ([null] or null) so this code ensure that the returning array always in the categories type
          categories: (todo.categories ?? []).filter((item) => item !== null),
        }))
      );

    return c.json({ data });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string().min(1) })), async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);
    try {
      const { id: todoId } = c.req.valid("param");

      const [data] = await db
        .select({
          id: todoTable.id,
          title: todoTable.title,
          description: todoTable.description,
          state: todoTable.state,
          doneIn: todoTable.doneIn,
          categories: sql<
            { id: string; name: string }[] | null | [null]
          >`json_agg(${categoryTable})`,
        })
        .from(todoTable)
        .leftJoin(todoToCategoryTable, eq(todoTable.id, todoToCategoryTable.todoId))
        .leftJoin(categoryTable, eq(todoToCategoryTable.categoryId, categoryTable.id))
        .where(and(eq(todoTable.userId, userId), eq(todoTable.id, todoId)))
        .groupBy(todoTable.id)
        .then((todos) =>
          todos.map((todo) => ({
            ...todo,
            // some times this sql exception "json_agg" return ([null] or null) so this code ensure that the returning array always in the categories type
            categories: (todo.categories ?? []).filter((item) => item !== null),
          }))
        );

      if (!data) return c.json({ message: "todo does not exist" }, 404);

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
      todoSchema
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
        .insert(todoTable)
        .values({ doneIn: values.doneIn, title: values.title, userId })
        .returning();

      if (values.categoryIds.length > 0) {
        const todoToCategoryValues = values.categoryIds.map((categoryId) => ({
          todoId: data.id,
          categoryId,
        }));

        await db.insert(todoToCategoryTable).values(todoToCategoryValues);
      }

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    zValidator(
      "json",
      todoSchema
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
      const { id: todoId } = c.req.valid("param");

      const [data] = await db
        .update(todoTable)
        .set({ doneIn: values.doneIn, title: values.title })
        .where(and(eq(todoTable.id, todoId), eq(todoTable.userId, userId)))
        .returning();

      await db.delete(todoToCategoryTable).where(eq(todoToCategoryTable.todoId, data.id));

      if (values.categoryIds.length > 0) {
        const todoToCategoryValues = values.categoryIds.map((categoryId) => ({
          todoId: data.id,
          categoryId,
        }));

        await db.insert(todoToCategoryTable).values(todoToCategoryValues);
      }

      return c.json({ data });
    }
  )
  .patch(
    "/:id/todo-state",
    zValidator("json", todoSchema.pick({ state: true })),
    zValidator("param", z.object({ id: z.string().min(1) })),
    async (c) => {
      const auth = getAuth(c);
      const userId = auth?.userId;
      if (!userId) return c.json({ message: "you are not logged in." }, 401);

      const { state } = c.req.valid("json");
      const { id: todoId } = c.req.valid("param");

      const data = await db
        .update(todoTable)
        .set({ state })
        .where(and(eq(todoTable.id, todoId), eq(todoTable.userId, userId)));

      return c.json({ data });
    }
  )
  .delete("/:id", zValidator("param", z.object({ id: z.string().min(1) })), async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);

    const { id: todoId } = c.req.valid("param");

    const [data] = await db
      .delete(todoTable)
      .where(and(eq(todoTable.id, todoId), eq(todoTable.userId, userId)))
      .returning();

    return c.json({ data });
  });

export default app;
