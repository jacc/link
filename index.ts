import Bao from "baojs";

import { Oura } from "./modules/oura";
import { Steam } from "./modules/steam";
import { Wakatime } from "./modules/wakatime";

const app = new Bao();

app.get("/", async (ctx) => {
  const oura = await Oura();
  const coding = await Wakatime();
  const steam = await Steam();

  return ctx.sendPrettyJson({
    oura,
    coding,
    steam,
    src: {
      github: "https://github.com/jacc/api",
      creator: "https://jack.bio",
    },
  });
});

app.listen({ port: 3000 });
