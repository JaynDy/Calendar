import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "../../firebase";
import Logo from "../../icons/Logo.svg";
import Googl from "../../icons/Googl.svg";
import styles from "./Login.module.css";

export const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Error during login", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img src={Logo} alt="" className={styles.logoImg} />
      <button
        onClick={handleLogin}
        className={styles.loginButton}
        disabled={loading}
      >
        <img src={Googl} alt="" className={styles.googlImg} />
        <h2>Continue with Google</h2>
      </button>
    </div>
  );
};
