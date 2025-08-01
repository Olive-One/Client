// ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type ThemeName, themes, applyTheme, type ThemeColors } from '../config/themes';

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeColors: ThemeColors;
  availableThemes: ThemeName[];
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  storageKey = 'app-theme',
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(defaultTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, [storageKey]);

  // Apply theme whenever currentTheme changes
  useEffect(() => {
    const themeColors = themes[currentTheme];
    applyTheme(themeColors);
    
    // Save to localStorage
    localStorage.setItem(storageKey, currentTheme);
    
    // Update document class for dark mode
    const isDark = currentTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }, [currentTheme, storageKey]);

  const setTheme = (theme: ThemeName) => {
    if (themes[theme]) {
      setCurrentTheme(theme);
    }
  };

  const toggleTheme = () => {
    setCurrentTheme(current => current === 'dark' ? 'light' : 'dark');
  };

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    themeColors: themes[currentTheme],
    availableThemes: Object.keys(themes) as ThemeName[],
    toggleTheme,
    isDark: currentTheme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};