// Multi-select with a "None" option: `[]` is "None", `null` is unanswered.
// Picking None clears the rest; picking anything else clears None; taking
// the last one off leaves it unanswered again.
export const toggleChoice = <T extends string>(
  current: T[] | null,
  value: T,
) => {
  const selected = current ?? [];
  const next = selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
  return next.length > 0 ? next : null;
};
