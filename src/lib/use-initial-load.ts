import { isUnauthorizedError, reportRequestError } from "@/lib/http-client";
import { useEffect, useState } from "react";

// Runs `load` once `enabled` is true and tracks the first load's outcome:
// skeleton while it's in flight, an error (with retry) if it fails. Later
// refreshes elsewhere don't go through here, so they never flash these states.
export function useInitialLoad(load: () => Promise<unknown>, enabled = true) {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let isActive = true;

    load()
      .then(() => isActive && setHasError(false))
      .catch((error) => {
        reportRequestError("Initial load failed:", error);
        // A 401 is already redirecting to sign-in; don't flash an error card.
        if (isActive && !isUnauthorizedError(error)) setHasError(true);
      })
      .finally(() => isActive && setIsInitialLoad(false));

    return () => {
      isActive = false;
    };
    // Only on mount / when it becomes enabled; `retry` handles re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const retry = async () => {
    setIsRetrying(true);
    try {
      await load();
      setHasError(false);
    } catch (error) {
      reportRequestError("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  return { isInitialLoad, hasError, isRetrying, retry };
}
