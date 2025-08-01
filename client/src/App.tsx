/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import AppProvider from "./context/AppProvider";
import { AuthProvider } from "./context/authentication/AuthProvider";
import { applyTheme, themes, type ThemeColors, type ThemeName } from "./config/themes";
import { fetchData } from "./services/api";
import API_URLS from "./services/apiUrls";
import AppLoader from "./components/shared/AppLoader";
import type { ClientConfigType } from "./types/config.types";
import { AuthenticatedRoutes, UnauthenticatedRoutes } from "./routes/routes";
import { I18nextProvider } from "react-i18next";
import i18n, { setLanguage } from "./translation/i18n";
import { ThemeProvider } from "./theme/ThemeProvider";

const router = createBrowserRouter(
  createRoutesFromElements([AuthenticatedRoutes, UnauthenticatedRoutes])
);

const App: React.FC = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<ClientConfigType | null>(null);

  // Function to generate and apply theme from server config
  const generateTheme = (themeConfig?: any): ThemeColors => {
    if (!themeConfig) {
      return themes.light;
    }

    // If server provides a theme name that matches our themes
    if (themeConfig.themeName && themes[themeConfig.themeName as ThemeName]) {
      return themes[themeConfig.themeName as ThemeName];
    }

    // Create a custom theme based on server config
    const customTheme = {
      ...themes.light, // Start with light theme as base
      // Override with server-provided colors if available
      ...(themeConfig.background && { background: themeConfig.background }),
      ...(themeConfig.foreground && { foreground: themeConfig.foreground }),
      ...(themeConfig.card && { card: themeConfig.card }),
      ...(themeConfig.cardForeground && { cardForeground: themeConfig.cardForeground }),
      ...(themeConfig.popover && { popover: themeConfig.popover }),
      ...(themeConfig.popoverForeground && { popoverForeground: themeConfig.popoverForeground }),
      ...(themeConfig.primary && { primary: themeConfig.primary }),
      ...(themeConfig.primaryForeground && { primaryForeground: themeConfig.primaryForeground }),
      ...(themeConfig.secondary && { secondary: themeConfig.secondary }),
      ...(themeConfig.secondaryForeground && { secondaryForeground: themeConfig.secondaryForeground }),
      ...(themeConfig.muted && { muted: themeConfig.muted }),
      ...(themeConfig.mutedForeground && { mutedForeground: themeConfig.mutedForeground }),
      ...(themeConfig.accent && { accent: themeConfig.accent }),
      ...(themeConfig.accentForeground && { accentForeground: themeConfig.accentForeground }),
      ...(themeConfig.destructive && { destructive: themeConfig.destructive }),
      ...(themeConfig.destructiveForeground && { destructiveForeground: themeConfig.destructiveForeground }),
      ...(themeConfig.border && { border: themeConfig.border }),
      ...(themeConfig.input && { input: themeConfig.input }),
      ...(themeConfig.ring && { ring: themeConfig.ring }),
      ...(themeConfig.cardBackground && { cardBackground: themeConfig.cardBackground }),
      ...(themeConfig.cardBorder && { cardBorder: themeConfig.cardBorder }),
    };

    return customTheme;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAndApplyConfig = async () => {
      try {
        const data: ClientConfigType = await fetchData<ClientConfigType>(
          API_URLS.CLIENT_CONFIG
        );
        if (!isMounted) return;
        
        const { translationConfig, themeConfig } = data;
        
        // Generate and apply theme
        const generatedTheme = generateTheme(themeConfig);
        applyTheme(generatedTheme);
        
        // Apply additional theme properties as CSS variables
        if (themeConfig?.spacing) {
          const root = document.documentElement;
          Object.entries(themeConfig.spacing).forEach(([key, value]) => {
            root.style.setProperty(`--spacing-${key}`, value as string);
          });
        }
        
        if (themeConfig?.typography) {
          const root = document.documentElement;
          Object.entries(themeConfig.typography).forEach(([key, value]) => {
            root.style.setProperty(`--typography-${key}`, value as string);
          });
        }
        
        // Set up translations
        await setLanguage(
          translationConfig?.activeLanguage || 'en', 
          translationConfig?.translations || {}
        );
        
        if (!isMounted) return;
        setConfig(data);
      } catch (error) {
        console.error("Error loading config:", error);
        // Apply default theme on error
        applyTheme(themes.light);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAndApplyConfig();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-background text-foreground flex items-center justify-center">
        <AppLoader />
      </div>
    );
  }

  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="light">
        <AppProvider>
          <I18nextProvider i18n={i18n}>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </I18nextProvider>
        </AppProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

export default App;