import { env } from "../../../utils/envsafe";

export async function getPresence() {
  const data = await fetch(
    `https://api.lanyard.rest/v1/users/${env.DISCORD_ID}`
  );

  const json = await data.json();

  const coding = json.data.activities.find(
    (activity: any) => activity.name === "Code"
  );

  return {
    coding:
      coding && coding.details
        ? {
            state: coding.state,
            details: coding.details,
          }
        : null,
  };
}
