import { eventBus } from './event-bus';
import { deleteToken, getToken } from './token';

// Thrown on 401. By then the token is cleared and the app is already heading
// to sign-in, so callers should treat it as expected, not as a failure.
export class UnauthorizedError extends Error {
  constructor() {
    super('UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

// Errors as plain data. Redux actions must be serializable, so thunks reject
// with this (via toRequestError) instead of the Error instance itself.
export type RequestError = { name: string; message: string };

export function toRequestError(error: unknown): RequestError {
  if (error instanceof Error) return { name: error.name, message: error.message };
  return { name: 'Error', message: String(error) };
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


async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
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
    await deleteToken();
    eventBus.emit('auth:unauthorized');
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? 'Something went wrong');
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