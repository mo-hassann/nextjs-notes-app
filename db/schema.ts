import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  varchar,
  pgEnum,
  timestamp,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const todoStateEnum = pgEnum("todo_state", ["TODO", "COMPLETED"]);

export const todoTable = pgTable("todo", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  state: todoStateEnum("todo_state").default("TODO").notNull(),
  doneIn: timestamp("done_in").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryTable = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  userId: text("user_id").notNull(),
});

export const todoToCategoryTable = pgTable(
  "todo_to_category",
  {
    todoId: uuid("todo_id")
      .notNull()
      .references(() => todoTable.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categoryTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey(table.todoId, table.categoryId),
  })
);

// relations
export const todoRelations = relations(todoTable, ({ one, many }) => ({
  todoToCategory: many(todoToCategoryTable),
}));

export const categoryRelations = relations(categoryTable, ({ one, many }) => ({
  todoToCategory: many(todoToCategoryTable),
}));

export const todoToCategoryRelations = relations(todoToCategoryTable, ({ one, many }) => ({
  todo: one(todoTable, {
    fields: [todoToCategoryTable.todoId],
    references: [todoTable.id],
  }),
  category: one(categoryTable, {
    fields: [todoToCategoryTable.categoryId],
    references: [categoryTable.id],
  }),
}));

// zod schemas
export const todoSchema = createSelectSchema(todoTable, {
  doneIn: z.coerce.date(),
  title: z.string().min(3, "title must be at least 3 chars"),
});
export const categorySchema = createSelectSchema(categoryTable, {
  name: z.string().min(3, "category name must be at least 1 chars"),
});
