import "./App.css";
import React, { useEffect } from "react";
import { CalendarApp } from "./components/CalendarApp";
import { Login } from "./components/Login/Login";
import { useState } from "react";
import { getAuth, getRedirectResult } from "firebase/auth";

export function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result", error);
      });
  }, []);

  return (
    <>
      <div className="app">
        {user ? <CalendarApp user={user} /> : <Login setUser={setUser} />}
      </div>
    </>
  );
}
