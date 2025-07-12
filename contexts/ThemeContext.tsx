import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";

export type ThemeMode = "auto" | "light" | "dark";
// Define types for the context
interface ThemeContextType {
  themeMode: ThemeMode;
  theme: MD3Theme;
  updateTheme: (mode: ThemeMode) => Promise<void>;
}

// Create context with TypeScript type
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("auto");

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem("appTheme");
      if (savedTheme) setThemeMode(savedTheme as ThemeMode);
    })();
  }, []);

  const theme: MD3Theme = (() => {
    if (themeMode === "dark") return MD3DarkTheme;
    if (themeMode === "light") return MD3LightTheme;
    return systemColorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  })();

  const updateTheme = async (mode: ThemeMode) => {
    setThemeMode(mode);
    await AsyncStorage.setItem("appTheme", mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export { ThemeProvider, useThemeContext };
export default ThemeProvider;
