// Filename: src/context/AuthContext.js
"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("/api/me");
      console.log("Check user response:", res);
      if (res.ok) {
        const { user } = await res.json();
        if (user) {
          setUser(user);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (strapiJwt, strapiUser) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwt: strapiJwt }),
    });

    if (res.ok) {
      console.log("strapi user: ", strapiUser);
      setUser(strapiUser);
      // Use a hard reload to prevent race conditions
      window.location.href = "/dashboard";
    } else {
      console.error("Failed to set session cookie");
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
