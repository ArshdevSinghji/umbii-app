const CM_PER_FOOT = 30.48;
const CM_PER_INCH = 2.54;

export type HeightUnit = "cm" | "ft";

export function cmToFeet(cm: number) {
  return Number((cm / CM_PER_FOOT).toFixed(1));
}

export function feetToCm(feet: number) {
  return Math.round(feet * CM_PER_FOOT);
}

// e.g. 170 -> "5 ft 7 in"
export function formatFeetAndInches(cm: number) {
  const totalInches = Math.round(cm / CM_PER_INCH);
  return `${Math.floor(totalInches / 12)} ft ${totalInches % 12} in`;
}
