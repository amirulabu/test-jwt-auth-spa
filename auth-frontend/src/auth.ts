import { setAccessToken } from "./accessToken";
import "whatwg-fetch";

export async function login(email: string, password: string) {
  const response = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.status >= 200 && response.status < 300) {
    const { data } = await response.json();
    setAccessToken(data.token);
    return true;
  } else {
    return false;
  }
}

export async function register(email: string, password: string) {
  await fetch("http://localhost:4000/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  await fetch("http://localhost:4000/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  setAccessToken("");
}
