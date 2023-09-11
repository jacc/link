import { env } from "@utils/envsafe";

export async function Steam() {
  const data = await fetch(
    `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${env.STEAM_KEY}&steamid=${env.STEAM_ID}`
  );
  const json = (await data.json()) as any;

  const games = json.response.games.map((game: any) => {
    return {
      appid: game.appid,
      name: game.name,
      playtime: Math.floor(game.playtime_2weeks / 60),
    };
  });

  const total = games.reduce(
    (accumulator: number, game: any) => accumulator + game.playtime,
    0
  );

  return { playtime: `${total} hours` };
}
