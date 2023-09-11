import { env } from "@utils/envsafe";

function getYesterdayDate(): string {
  let date = new Date();
  date.setDate(date.getDate() - 2);
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function getTodayDate(): string {
  let date = new Date();
  date.setDate(date.getDate() - 1);
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function secondsToHms(d: number) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes") : "";
  return hDisplay + mDisplay;
}

export async function Oura() {
  // Create a new Date object for the current date and time in the EST timezone
  const estDate = new Date();
  estDate.setUTCHours(estDate.getUTCHours() - 5); // Adjust for the EST timezone offset

  // Subtract 5 minutes (5 * 60 * 1000 milliseconds) from the EST date
  estDate.setTime(estDate.getTime() - 5 * 60 * 1000);

  // Format the adjusted EST date as an ISO string
  const estTimestamp = estDate.toISOString();

  const yesterdayDate = getYesterdayDate();
  const todayDate = getTodayDate();
  try {
    const [sleepBody, activityBody, heartRateBody] = await Promise.all([
      fetch(
        `https://api.ouraring.com/v1/sleep?access_token=${env.OURA}&start=${yesterdayDate}&end=${yesterdayDate}`
      ).then((res) => res.json() as any),
      fetch(
        `https://api.ouraring.com/v1/activity?access_token=${env.OURA}&start=${todayDate}&end=${todayDate}`
      ).then((res) => res.json() as any),
      fetch(
        `https://api.ouraring.com/v2/usercollection/heartrate?start_timestamp=${estTimestamp}`,
        {
          headers: {
            Authorization: `Bearer ${env.OURA}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res: any) => res.data.slice(-1)),
    ]);

    return {
      sleep: {
        time: secondsToHms(sleepBody.sleep[0].duration),
        efficiency: sleepBody.sleep[0].score_efficiency,
      },
      activity: {
        calories: activityBody.activity[0].cal_active,
        steps: activityBody.activity[0].daily_movement,
      },
      heart: {
        bpm: heartRateBody[0].bpm,
        awake: heartRateBody[0].source == "awake" || "live" ? true : false,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      sleep: null,
      activity: null,
      heart: null,
    };
  }
}
