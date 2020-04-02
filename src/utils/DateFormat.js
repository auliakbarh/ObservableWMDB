export const months = {
  0: 'Januari',
  1: 'Februari',
  2: 'Maret',
  3: 'April',
  4: 'Mei',
  5: 'Juni',
  6: 'Juli',
  7: 'Agustus',
  8: 'September',
  9: 'Oktober',
  10: 'November',
  11: 'Desember',
};

export function getDate(param, fullDate = false) {
  try {
    const datetime = new Date(param);
    const date = datetime.getDate();
    const month = fullDate
      ? months[datetime.getMonth()]
      : months[datetime.getMonth()].slice(0, 3);
    const year = fullDate
      ? datetime.getFullYear()
      : datetime
          .getFullYear()
          .toString()
          .slice(2, 4);

    return `${date} ${month} ${year}`;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function getTime(param) {
  try {
    const datetime = new Date(param);
    const hour = datetime.getUTCHours();
    const minute = datetime.getUTCMinutes();

    return `${hour}:${minute}`;
  } catch (e) {
    console.log(e);
    return null;
  }
}
