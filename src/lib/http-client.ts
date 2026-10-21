import { eventBus } from './event-bus';
import { AuthTokens, clearSession, getRefreshToken, getToken, saveTokens } from './token';

// Thrown when the session can't be recovered (a 401 a refresh can't fix). By
// then the tokens are cleared and the app is already heading to sign-in, so
// callers should treat it as expected, not as a failure.
export class UnauthorizedError extends Error {
  constructor() {
    super('UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

// Any non-2xx response other than 401. Keeps the status so callers can tell
// e.g. 409 (conflict) from 404 (not found).
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

// Errors as plain data. Redux actions must be serializable, so thunks reject
// with this (via toRequestError) instead of the Error instance itself.
export type RequestError = { name: string; message: string; status?: number };

export function toRequestError(error: unknown): RequestError {
  if (error instanceof HttpError) {
    return { name: error.name, message: error.message, status: error.status };
  }
  if (error instanceof Error) return { name: error.name, message: error.message };
  return { name: 'Error', message: String(error) };
}

// HTTP status of a failed request (from HttpError or its plain form).
export function getErrorStatus(error: unknown) {
  const status = (error as { status?: unknown } | null)?.status;
  return typeof status === 'number' ? status : undefined;
}

// Works on both the Error instance and its plain RequestError form (what
// `.unwrap()` hands back), since `instanceof` doesn't survive the latter.
export function isUnauthorizedError(error: unknown) {
  return (error as { name?: string } | null)?.name === 'UnauthorizedError';
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  const message = (error as { message?: unknown } | null)?.message;
  return typeof message === 'string' && message ? message : fallback;
}

// For fire-and-forget requests (e.g. fetches in useEffect): log real
// failures, stay quiet about 401s.
export function reportRequestError(context: string, error: unknown) {
  if (isUnauthorizedError(error)) return;
  console.error(context, error);
}

export type ApiResponse<T> = {
  message: string;
  data: T;
};

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
};


// 401 messages the client acts on.
const TOKEN_EXPIRED = 'Token expired';
const SESSION_ENDED = 'Session ended';

// Why the user was sent back to sign-in, for the note shown there.
// `session-ended`: the account signed in on another device.
export type SignOutReason = 'session-ended' | 'expired';

// Clears the session and sends the app to sign-in. No reason when no token
// was sent (nothing to explain).
async function endSession(reason?: SignOutReason): Promise<never> {
  await clearSession();
  eventBus.emit('auth:unauthorized', { reason });
  throw new UnauthorizedError();
}

let refreshInFlight: Promise<void> | null = null;

// Swaps the refresh token for a new pair. Refresh tokens are single use and
// the server treats two refreshes with the same one as theft (it ends the
// session), so concurrent 401s share one refresh.
function refreshTokens(staleToken: string) {
  refreshInFlight ??= runRefresh(staleToken).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function runRefresh(staleToken: string) {
  // Another request already refreshed after this one was sent.
  if ((await getToken()) !== staleToken) return;

  const refreshToken = await getRefreshToken();
  if (!refreshToken) return endSession('expired');

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  // Session ended (signed in elsewhere), refresh token expired or invalid.
  if (response.status === 401) {
    const error = await response.json().catch(() => ({}));
    const isSessionEnded = String(error.message ?? '').startsWith(SESSION_ENDED);
    return endSession(isSessionEnded ? 'session-ended' : 'expired');
  }

  // Anything else (5xx, network) keeps the tokens: the request just fails.
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new HttpError(response.status, error.message ?? 'Something went wrong');
  }

  const { data } = (await response.json()) as ApiResponse<AuthTokens>;
  await saveTokens(data);
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let url = `${BASE_URL}${endpoint}`;
  if (options.params) {
    const queryString = Object.entries(options.params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    if (queryString) url += `?${queryString}`;
  }

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    const error = await response.json().catch(() => ({}));
    // Refresh once, then retry with the new token.
    if (error.message === TOKEN_EXPIRED && token && !isRetry) {
      await refreshTokens(token);
      return request<T>(endpoint, options, true);
    }
    // Invalid token / Token not found.
    return endSession(token ? 'expired' : undefined);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new HttpError(response.status, error.message ?? 'Something went wrong');
  }

  return response.json();
}

export const http = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: Record<string, unknown>, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body: Record<string, unknown>, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body: Record<string, unknown>, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};