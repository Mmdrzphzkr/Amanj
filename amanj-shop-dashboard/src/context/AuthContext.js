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
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const { user } = await res.json();
          if (user) {
            console.log("User data with role:", user);
            // The user object now includes role from the backend
            setUser(user);
          }
        } else {
          console.warn("Failed to fetch /api/me");
        }
      } catch (err) {
        console.error("Error checking user:", err);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (strapiJwt, strapiUser, callbackUrl) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwt: strapiJwt }),
    });

    if (res.ok) {
      setUser(strapiUser);
      // Use a hard reload to prevent race conditions
      const destination = callbackUrl || "/";
      window.location.href = destination;
    } else {
      console.error("Failed to set session cookie");
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    // navigate to homepage after logout
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
