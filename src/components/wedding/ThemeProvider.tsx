import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeId = "kerala" | "western" | "fusion";

interface ThemeCtx {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  loading: boolean;
}

const Ctx = createContext<ThemeCtx>({ theme: "kerala", setTheme: () => {}, loading: true });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>("kerala");
  const [loading, setLoading] = useState(true);

  // Fetch default theme from backend on mount
  useEffect(() => {
    async function fetchDefaultTheme() {
      try {
        const res = await fetch('/api/theme');
        const { data, error } = await res.json();
        if (!error && data?.default_theme) {
          setTheme(data.default_theme as ThemeId);
        }
      } catch (e) {
        // Fallback to kerala if fetch fails
      } finally {
        setLoading(false);
      }
    }
    fetchDefaultTheme();
  }, []);

  // Apply theme to document when it changes
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.weddingTheme = theme;
  }, [theme]);

  return <Ctx.Provider value={{ theme, setTheme, loading }}>{children}</Ctx.Provider>;
}

export const useWeddingTheme = () => useContext(Ctx);

export const THEMES: { id: ThemeId; label: string; tagline: string }[] = [
  { id: "kerala", label: "Kerala Quranic", tagline: "Sacred heirloom" },
  { id: "western", label: "Western Editorial", tagline: "Vogue minimalism" },
  { id: "fusion", label: "Global Fusion", tagline: "World couture" },
];
