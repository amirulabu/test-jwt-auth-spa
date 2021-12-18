import { useContext, useState } from "react";
import { login } from "../auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const { loggedIn, setLoggedIn } = useContext(AuthContext);

  return (
    <main>
      <h2>Login</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("form submitted");
          const success = await login(email, password);
          if (success) {
            navigate("/protected", { replace: true });
            setLoggedIn(true);
          } else {
            navigate("/", { replace: true });
          }
        }}
      >
        <div>
          <input
            value={email}
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </main>
  );
}
