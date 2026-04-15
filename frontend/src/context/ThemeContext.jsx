/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // ✅ Always use dark theme (stable theme)
  const isDarkMode = true;

  // ✅ Apply theme to document root element
  useEffect(() => {
    const htmlElement = document.documentElement;

    // Always apply dark class
    htmlElement.classList.add("dark");
  }, []);

  const value = {
    isDarkMode,
    theme: "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
