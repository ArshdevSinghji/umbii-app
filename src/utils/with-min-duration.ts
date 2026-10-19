// Resolves (or rejects) with `promise`, but never sooner than `ms`: a
// loading screen that's gone in a blink reads as a glitch, not a load.
export async function withMinDuration<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T> {
  const [result] = await Promise.allSettled([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);
  if (result.status === "rejected") throw result.reason;
  return result.value;
}
