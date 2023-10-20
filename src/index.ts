import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { music } from "./modules/music/albums";

const app = new Elysia()
  .use(cors())
  .use(music)
  .get("/", () => "hello")
  .listen(3000);
