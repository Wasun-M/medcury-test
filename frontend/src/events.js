const events = [
  {
    title: "หมอ ก",
    start: getDate("YEAR-MONTH-18T08:00:00"),
    end: getDate("YEAR-MONTH-18T08:30:00"),
  },
  {
    title: "หมอ ก",
    start: getDate("YEAR-MONTH-18T08:30:00"),
    end: getDate("YEAR-MONTH-18T09:00:00"),
  },
  {
    title: "หมอ ข",
    start: getDate("YEAR-MONTH-18T13:00:00"),
    end: getDate("YEAR-MONTH-18T13:30:00"),
  },
  {
    title: "หมอ ข",
    start: getDate("YEAR-MONTH-18T13:30:00"),
    end: getDate("YEAR-MONTH-18T14:00:00"),
  },
];

function getDate(dayString) {
  const today = new Date();
  const year = today.getFullYear().toString();
  let month = (today.getMonth() + 1).toString();

  if (month.length === 1) {
    month = "0" + month;
  }

  return dayString.replace("YEAR", year).replace("MONTH", month);
}

export default events;
