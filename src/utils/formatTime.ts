
//utils/formatTime.ts

export function formatHourToDate(date: Date, hour: string): Date {
  const [h, m] = hour.split(':');
  const newDate = new Date(date);
  newDate.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
  return newDate;
}
