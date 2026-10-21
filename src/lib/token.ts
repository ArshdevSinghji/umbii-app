import * as SecureStore from 'expo-secure-store';

// The session lives only here (Keychain / Keystore): both tokens and the
// signed-in user's id, which every /users/{userId} route needs at launch. The
// rest of the account is refetched (GET /users/{id}), not stored.
// The access token lasts 15 minutes; the refresh token 30 days and is single
// use, so every refresh replaces both.
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_ID_KEY = 'auth_user_id';

export type AuthTokens = { token: string; refreshToken: string };

// After a refresh.
export const saveTokens = async ({ token, refreshToken }: AuthTokens) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

// After sign-in.
export const saveSession = async (session: AuthTokens & { userId: number }) => {
  await saveTokens(session);
  await SecureStore.setItemAsync(USER_ID_KEY, String(session.userId));
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const getUserId = async () => {
  const userId = await SecureStore.getItemAsync(USER_ID_KEY);
  return userId ? Number(userId) : null;
};

export const clearSession = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_ID_KEY);
};
