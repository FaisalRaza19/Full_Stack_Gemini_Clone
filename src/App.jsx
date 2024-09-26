import React, { useState, useEffect } from "react";
import Main from "./components/main/main.jsx";
import LoginPage from "./components/Login & SignUp/Login.jsx";
import SignUpPage from "./components/Login & SignUp/SignUp.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("token") !== null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(token !== null);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignUpPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
              <Route path="*" element={<Main setIsLoggedIn={setIsLoggedIn} />} />
              {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

