import db from "@/db";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { categorySchema, categoryTable } from "@/db/schema";
import { getAuth } from "@hono/clerk-auth";
import { and, eq } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);

    const data = await db.select().from(categoryTable).where(eq(categoryTable.userId, userId));

    return c.json({ data });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);

    const { id: categoryId } = c.req.valid("param");

    const [data] = await db
      .select()
      .from(categoryTable)
      .where(and(eq(categoryTable.userId, userId), eq(categoryTable.id, categoryId)));

    return c.json({ data });
  })
  .post("/", zValidator("json", categorySchema.pick({ name: true })), async (c) => {
    const auth = getAuth(c);
    const userId = auth?.userId;
    if (!userId) return c.json({ message: "you are not logged in." }, 401);

    const values = c.req.valid("json");

    const [data] = await db
      .insert(categoryTable)
      .values({ ...values, userId })
      .returning();

    return c.json({ data });
  });

export default app;
