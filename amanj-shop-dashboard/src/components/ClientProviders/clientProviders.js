// src/components/ClientProviders.jsx
"use client";

import { AuthProvider } from "@/context/AuthContext";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import ThemeRegistry from "@/components/Theme/ThemeRegistry";

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </Provider>
    </AuthProvider>
  );
}
