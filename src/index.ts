import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { getAlbums } from "./modules/music/albums";
import { currentStream } from "./modules/music/current";

const app = new Elysia()
  .use(cors())
  .group("/music", (music) =>
    music
      .get("/current", async () => currentStream)
      .get("/albums", async () => getAlbums)
  )
  .listen(3000);
