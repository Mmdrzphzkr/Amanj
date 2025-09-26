// src/components/ThemeRegistry.jsx
"use client";

import React, { useMemo } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import stylisPluginRtl from "stylis-plugin-rtl";

const theme = createTheme({
  typography: {
    fontFamily: "Vazirmatn, roboto, sans-serif",
  },
  direction: "rtl",
  palette: {
    mode: "light",
  },
});

function NextAppDirEmotionCacheProvider({
  options = { key: "mui" },
  children,
}) {
  const cache = useMemo(() => {
    const cache = createCache({
      key: options.key || "mui",
      prepend: true,
      stylisPlugins: [stylisPluginRtl],
    });
    return cache;
  }, [options.key]);
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

export default function ThemeRegistry({ children }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
