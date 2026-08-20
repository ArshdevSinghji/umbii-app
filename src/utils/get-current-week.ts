export function getCurrentWeek() {
  const today = new Date();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return Array.from({ length: 7 }, (_, index) => {
    const offset = index - 3;

    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    return {
      week: days[date.getDay()],
      date: date.getDate(),
      fullDate: date.toISOString().split("T")[0],
      isToday: offset === 0,
    };
  });
}
