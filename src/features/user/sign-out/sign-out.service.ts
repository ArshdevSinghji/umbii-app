// Ends this device's session on the server: revokes the refresh token and
// every token rotated from the same sign-in. Always 200, no access token
// needed. The access token keeps working until it expires, so delete it too.
export const signOutService = async (refreshToken: string) => {
  const url = process.env.EXPO_PUBLIC_API_URL;
  await fetch(`${url}/auth/sign-out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
};
