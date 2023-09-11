import { envsafe, str } from "envsafe";

export const env = envsafe({
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "staging", "production"],
  }),
  OURA: str(),
  STEAM_KEY: str(),
  STEAM_ID: str(),
  WAKATIME: str(),
});
