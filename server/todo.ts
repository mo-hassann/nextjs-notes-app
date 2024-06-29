import db from "@/db";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { string, z } from "zod";
import { categoryTable, todoSchema, todoTable, todoToCategoryTable } from "@/db/schema";
import { getAuth } from "@hono/clerk-auth";
import { and, arrayContains, eq, sql } from "drizzle-orm";

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
        categories: sql<({ id: string; name: string } | null)[] | null>`json_agg(${categoryTable})`,
      })
      .from(todoTable)
      .leftJoin(todoToCategoryTable, eq(todoTable.id, todoToCategoryTable.todoId))
      .leftJoin(categoryTable, eq(todoToCategoryTable.categoryId, categoryTable.id))
      .where(eq(todoTable.userId, userId))
      .groupBy(todoTable.id);

    return c.json({ data });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);

    const { id: todoId } = c.req.valid("param");

    const [data] = await db
      .select()
      .from(todoToCategoryTable)
      .where(and(eq(todoTable.userId, userId), eq(todoTable.id, todoId)))
      .leftJoin(categoryTable, eq(todoToCategoryTable.categoryId, categoryTable.id))
      .leftJoin(todoTable, eq(todoToCategoryTable.todoId, todoTable.id));

    return c.json({ data });
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

      const todoToCategoryValues = values.categoryIds.map((categoryId) => ({
        todoId: data.id,
        categoryId,
      }));

      await db.insert(todoToCategoryTable).values(todoToCategoryValues);

      return c.json({ data });
    }
  );

export default app;
