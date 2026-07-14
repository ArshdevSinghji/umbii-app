import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(text = "username") {
  return text
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

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