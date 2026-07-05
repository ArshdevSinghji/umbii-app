import { eventBus } from '@/lib/event-bus';
import { getToken } from '@/lib/token';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getToken().then((t) => {
      setToken(t);
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