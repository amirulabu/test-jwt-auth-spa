import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import { logout } from "../auth";

export default function Navbar() {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/protected">Protected</Link>
      {loggedIn && (
        <button
          onClick={async () => {
            await logout();
            setLoggedIn(false);
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}
