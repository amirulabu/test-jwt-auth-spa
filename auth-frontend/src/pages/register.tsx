import { useState } from "react";
import { register } from "../auth";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  return (
    <main>
      <h2>Register</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("form submitted");
          console.log(email, password);
          await register(email, password);
          navigate("/login", { replace: true });
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
        <button type="submit">register</button>
      </form>
    </main>
  );
}
