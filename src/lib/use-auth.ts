import { setUserId } from '@/features/user/user.slice';
import { eventBus } from '@/lib/event-bus';
import { getToken, getUserId } from '@/lib/token';
import { store } from '@/store/store';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore the session before any screen renders: screens need the user
    // id for their requests; the rest of the account is loaded on launch.
    Promise.all([getToken(), getUserId()]).then(([token, userId]) => {
      if (token && userId) store.dispatch(setUserId(userId));
      setToken(token && userId ? token : null);
      setIsLoading(false);
    });

    const clearAuth = () => setToken(null);
    const setAuth = ({ token }: { token: string }) => setToken(token);

    eventBus.on('auth:signin', setAuth);
    eventBus.on('auth:unauthorized', clearAuth);
    eventBus.on('auth:signout', clearAuth);

    return () => {
      eventBus.off('auth:signin', setAuth);
      eventBus.off('auth:unauthorized', clearAuth);
      eventBus.off('auth:signout', clearAuth);
    };
  }, []);

  return { token, isLoading };
}
