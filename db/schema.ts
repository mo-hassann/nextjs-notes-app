import { relations } from "drizzle-orm";
import { pgTable, uuid, text, integer, varchar, pgEnum, timestamp, unique, primaryKey } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const noteStateEnum = pgEnum("note_state", ["TODO", "COMPLETED"]); // note make third option "INPROGRESS"

export const noteTable = pgTable("note", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  state: noteStateEnum("note_state").default("TODO").notNull(),
  doneIn: timestamp("done_in").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categoryTable = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  userId: text("user_id").notNull(),
});

export const noteToCategoryTable = pgTable(
  "note_to_category",
  {
    noteId: uuid("note_id")
      .notNull()
      .references(() => noteTable.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categoryTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey(table.noteId, table.categoryId),
  })
);

// relations
export const noteRelations = relations(noteTable, ({ one, many }) => ({
  noteToCategory: many(noteToCategoryTable),
}));

export const categoryRelations = relations(categoryTable, ({ one, many }) => ({
  noteToCategory: many(noteToCategoryTable),
}));

export const noteToCategoryRelations = relations(noteToCategoryTable, ({ one, many }) => ({
  note: one(noteTable, {
    fields: [noteToCategoryTable.noteId],
    references: [noteTable.id],
  }),
  category: one(categoryTable, {
    fields: [noteToCategoryTable.categoryId],
    references: [categoryTable.id],
  }),
}));

// zod schemas
export const noteSchema = createSelectSchema(noteTable, {
  doneIn: z.coerce.date(),
  title: z.string().min(3, "title must be at least 3 chars"),
});
export const categorySchema = createSelectSchema(categoryTable, {
  name: z.string().min(3, "category name must be at least 1 chars"),
});
