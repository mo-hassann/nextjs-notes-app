import { Hono } from "hono";
import { handle } from "hono/vercel";

import todo from "@/server/todo";
import category from "@/server/category";
import { clerkMiddleware } from "@hono/clerk-auth";

// export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app /*  */
  .use("*", clerkMiddleware())
  .route("/todo", todo)
  .route("/category", category);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
