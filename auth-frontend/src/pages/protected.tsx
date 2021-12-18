import { useEffect, useState } from "react";
import { getAccessToken } from "../accessToken";
import authenticatedFetch from "../fetch";

export default function Protected() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    authenticatedFetch("http://localhost:4000/users", "GET").then((u) =>
      setUsers(u)
    );
  }, users);

  return (
    <main>
      <h2>Protected</h2>
      {getAccessToken() !== "" ? (
        <p>You are logged in</p>
      ) : (
        <p>You are not logged in</p>
      )}

      <ul>
        {users.map((u) => (
          <li>{JSON.stringify(u)}</li>
        ))}
      </ul>
    </main>
  );
}
