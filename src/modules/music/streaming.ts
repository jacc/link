import { env } from "../../../utils/envsafe";

const reqParams = "&format=json&api_key=" + env.LASTFM_TOKEN;

export async function currentStream() {
  const response = await (
    await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${env.LASTFM_USER}&limit=1${reqParams}`
    )
  ).json();

  const track = response.recenttracks.track[0];

  return track["@attr"]
    ? {
        streaming: {
          artist: track.artist["#text"],
          album: track.album["#text"],
          track: track.name,
          cover: track.image[3]["#text"],
        },
      }
    : { streaming: null };
}
