import React, { useState, useEffect } from "react";
import { setAccessToken } from "./accessToken";
import "simpledotcss/simple.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Home from "./pages/home";
import LoginPage from "./pages/loginPage";
import Navbar from "./components/navbar";
import RegisterPage from "./pages/register";
import Protected from "./pages/protected";

export const AuthContext = React.createContext<{
  loggedIn: boolean;
  setLoggedIn: (a: boolean) => void;
}>({ loggedIn: false, setLoggedIn: () => {} });

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/auth/refresh", {
      method: "POST",
      credentials: "include",
    }).then(async (x) => {
      if (x.status >= 200 && x.status < 300) {
        const { data } = await x.json();
        setAccessToken(data.token);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      <div className="App">
        <BrowserRouter>
          <header>
            <h1>Hello, world</h1>
            <p>Welcome to my website!</p>
            <Navbar />
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/protected" element={<Protected />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
