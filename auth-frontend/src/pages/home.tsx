import { useContext, useEffect, useState } from "react";
import { getAccessToken } from "../accessToken";
import { AuthContext } from "../App";
import authenticatedFetch from "../fetch";

export default function Home() {
  const [users, setUsers] = useState([]);
  const { loggedIn } = useContext(AuthContext);

  useEffect(() => {
    authenticatedFetch("http://localhost:4000/users", "GET").then((u) =>
      setUsers(u)
    );
  }, users);
  return (
    <main>
      <h2>Home</h2>
      {loggedIn ? <p>You are logged in</p> : <p>You are not logged in</p>}

      <ul>
        {users.map((u) => (
          <li>{JSON.stringify(u)}</li>
        ))}
      </ul>
    </main>
  );
}
