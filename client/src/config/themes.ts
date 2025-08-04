// theme.ts
export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  cardBackground: string;
  cardBorder: string;
}

export const lightTheme: ThemeColors = {
  background: 'oklch(0.98 0.00 248)',
  foreground: 'oklch(0.25 0.08 285)',
  card: 'oklch(1 0 0)',
  cardForeground: 'oklch(0.25 0.08 285)',
  popover: 'oklch(1 0 0)',
  popoverForeground: 'oklch(0.25 0.08 285)',
  primary: 'oklch(0.50 0.24 302)',
  primaryForeground: 'oklch(1 0 0)',
  secondary: 'oklch(0.95 0.002 285)',
  secondaryForeground: 'oklch(0.25 0.08 285)',
  muted: 'oklch(0.95 0.002 285)',
  mutedForeground: 'oklch(0.45 0.08 285)',
  accent: 'oklch(0.95 0.002 285)',
  accentForeground: 'oklch(0.25 0.08 285)',
  destructive: 'oklch(0.577 0.245 27.325)',
  destructiveForeground: 'oklch(1 0 0)',
  border: 'oklch(0.56 0.25 302)',
  input: 'oklch(0.92 0.004 286.32)',
  ring: 'oklch(0.35 0.12 285)',
  cardBackground: 'oklch(1 0 0)',
  cardBorder: 'oklch(0.56 0.25 302)',
};

export const darkTheme: ThemeColors = {
  background: 'oklch(0.1 0 0)',
  foreground: 'oklch(1 0 0)',
  card: 'oklch(0.15 0.02 285)',
  cardForeground: 'oklch(1 0 0)',
  popover: 'oklch(0.15 0.02 285)',
  popoverForeground: 'oklch(1 0 0)',
  primary: 'oklch(0.35 0.12 285)',
  primaryForeground: 'oklch(1 0 0)',
  secondary: 'oklch(0.2 0.04 285)',
  secondaryForeground: 'oklch(1 0 0)',
  muted: 'oklch(0.2 0.04 285)',
  mutedForeground: 'oklch(0.7 0.02 285)',
  accent: 'oklch(0.2 0.04 285)',
  accentForeground: 'oklch(1 0 0)',
  destructive: 'oklch(0.704 0.191 22.216)',
  destructiveForeground: 'oklch(1 0 0)',
  border: 'oklch(0.56 0.25 302)',
  input: 'oklch(0.2 0.04 285)',
  ring: 'oklch(0.35 0.12 285)',
  cardBackground: 'oklch(0.13 0.03 262)',
  cardBorder: 'oklch(0.56 0.25 302)',
};

// Blue theme variant
export const blueTheme: ThemeColors = {
  ...lightTheme,
  primary: 'oklch(0.6 0.25 230)',
  primaryForeground: 'oklch(0.98 0.02 230)',
  ring: 'oklch(0.6 0.25 230)',
};

// Green theme variant
export const greenTheme: ThemeColors = {
  ...lightTheme,
  primary: 'oklch(0.6 0.25 150)',
  primaryForeground: 'oklch(0.98 0.02 150)',
  ring: 'oklch(0.6 0.25 150)',
};

// Red theme variant
export const redTheme: ThemeColors = {
  ...lightTheme,
  primary: 'oklch(0.65 0.25 25)',
  primaryForeground: 'oklch(0.98 0.02 25)',
  ring: 'oklch(0.65 0.25 25)',
};

export type ThemeName = 'light' | 'dark' | 'blue' | 'green' | 'red';

export type ThemeConfigType = {
  themeName: ThemeName;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  cardBackground: string;
  cardBorder: string;
  spacing: string;
  typography: string;
};

export const themes: Record<ThemeName, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  green: greenTheme,
  red: redTheme,
};

// Helper function to convert camelCase to CSS custom property names
export const toCSSVariable = (key: string): string => {
  return `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
};

// Function to apply theme to document root
export const applyTheme = (theme: ThemeColors): void => {
  const root = document.documentElement;
  
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(toCSSVariable(key), value);
  });
};

// Function to get current theme from CSS variables
export const getCurrentTheme = (): ThemeColors => {
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  
  return Object.keys(lightTheme).reduce((theme, key) => {
    const cssVar = toCSSVariable(key);
    theme[key as keyof ThemeColors] = computedStyle.getPropertyValue(cssVar).trim();
    return theme;
  }, {} as ThemeColors);
};