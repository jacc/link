function getFarDate(): string {
  let date = new Date();
  date.setDate(date.getDate() - 7);
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function getTodayDate(): string {
  let date = new Date();
  date.setDate(date.getDate());
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

export async function Wakatime() {
  const response = await fetch(
    `https://wakatime.com/api/v1/users/current/summaries?start=${getFarDate()}&end=${getTodayDate()}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.WAKATIME}`).toString(
          "base64"
        )}`,
      },
    }
  );

  const data = (await response.json()) as any;

  return {
    time: data.cumulative_total.text,
  };
}
