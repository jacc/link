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

  const sleep = await fetch(
    `https://api.ouraring.com/v1/sleep?access_token=${
      process.env.OURA
    }&start=${getYesterdayDate()}&end=${getYesterdayDate()}`
  );
  const sleepBody = (await sleep.json()) as any;

  const activity = await fetch(
    `https://api.ouraring.com/v1/activity?access_token=${
      process.env.OURA
    }&start=${getTodayDate()}&end=${getTodayDate()}`
  );
  const activityBody = (await activity.json()) as any;

  const heartRate = await fetch(
    `https://api.ouraring.com/v2/usercollection/heartrate?start_timestamp=${estTimestamp}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.OURA}`,
      },
    }
  );
  const heartRateBody = ((await heartRate.json()) as any).data.slice(-1);

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
}
