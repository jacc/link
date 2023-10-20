import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { getPresence } from "./modules/misc/discord";
import { getSteam } from "./modules/misc/steam";
import { getAlbums } from "./modules/music/albums";
import { currentStream } from "./modules/music/streaming";

const port = process.env.PORT ?? 3000;

const app = new Elysia()
  .use(cors())
  .get("/", async () => ({
    routes: [
      {
        "/music": {
          "/streaming": "GET",
          "/albums": "GET",
        },
      },
      {
        "/fun": {
          "/steam": "GET",
          "/discord": "GET",
        },
      },
    ],
  }))
  .group("/music", (music) =>
    music
      .get("/streaming", async () => currentStream)
      .get("/albums", async () => getAlbums)
  )
  .group("/fun", (fun) =>
    fun
      .get("/steam", async () => getSteam)
      .get("/discord", async () => getPresence)
  )
  .listen(port);

console.info(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
