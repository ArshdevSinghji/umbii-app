export function getInitials(text = "username") {
  return text
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}