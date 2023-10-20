import { env } from "../../../utils/envsafe";

const reqParams = "&format=json&api_key=" + env.LASTFM_TOKEN;

export async function getAlbums() {
  const response = await (
    await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${env.LASTFM_USER}&limit=50&period=1month${reqParams}`
    )
  ).json();

  const albums = response.topalbums.album.map((album: any) => {
    return {
      album: album.name,
      artist: album.artist.name,
      image: album.image[3]["#text"],
      plays: album.playcount,
    };
  });
  return {
    albums: albums,
  };
}
