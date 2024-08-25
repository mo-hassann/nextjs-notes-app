import { Hono } from "hono";
import { handle } from "hono/vercel";

import note from "@/server/note";
import category from "@/server/category";
import { clerkMiddleware } from "@hono/clerk-auth";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app /*  */
  .use("*", clerkMiddleware())
  .route("/note", note)
  .route("/category", category);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
