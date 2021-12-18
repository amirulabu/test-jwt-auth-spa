import { getAccessToken, setAccessToken } from "./accessToken";
import "whatwg-fetch";

export default async function authenticatedFetch(
  endpoint: string,
  method: string = "GET",
  body?: string,
  tries: number = 0
): Promise<any> {
  if (tries >= 2) {
    throw new Error("Failed to refresh the access token");
  }

  const response = await fetch(endpoint, {
    credentials: "include",
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body,
  });
  if (response.status >= 200 && response.status < 300) {
    return await response.json();
  } else {
    const refreshResponse = await fetch("http://localhost:4000/auth/refresh", {
      credentials: "include",
      method: "POST",
    });

    if (refreshResponse.status >= 200 && refreshResponse.status < 300) {
      const refreshjson = await refreshResponse.json();
      setAccessToken(refreshjson.data.token);
    }

    return authenticatedFetch(endpoint, method, body, tries + 1);
  }
}
