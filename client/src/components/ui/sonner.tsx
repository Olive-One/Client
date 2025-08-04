import { useTheme } from "@/theme/ThemeProvider"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { currentTheme } = useTheme()

  return (
    <Sonner
      theme={currentTheme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:shadow-lg group-[.toaster]:border group-[.toaster]:rounded-md group-[.toaster]:p-4",
          description: "group-[.toast]:opacity-80",
          actionButton: "group-[.toast]:rounded group-[.toast]:px-3 group-[.toast]:py-1",
          cancelButton: "group-[.toast]:rounded group-[.toast]:px-3 group-[.toast]:py-1",
        },
        style: {
          background: 'var(--theme-card)',
          color: 'var(--theme-card-foreground)',
          border: '1px solid var(--theme-border)',
        },
      }}
      style={{
        '--success-bg': currentTheme === 'dark' 
          ? 'oklch(0.15 0.15 142)' 
          : 'oklch(0.96 0.05 142)',
        '--success-text': currentTheme === 'dark' 
          ? 'oklch(0.8 0.15 142)' 
          : 'oklch(0.3 0.15 142)',
        '--success-border': 'oklch(0.6 0.2 142)',
        
        '--error-bg': currentTheme === 'dark' 
          ? 'oklch(0.15 0.15 25)' 
          : 'oklch(0.96 0.05 25)',
        '--error-text': currentTheme === 'dark' 
          ? 'oklch(0.8 0.15 25)' 
          : 'oklch(0.3 0.15 25)',
        '--error-border': 'oklch(0.6 0.2 25)',
        
        '--info-bg': currentTheme === 'dark' 
          ? 'oklch(0.15 0.15 230)' 
          : 'oklch(0.96 0.05 230)',
        '--info-text': currentTheme === 'dark' 
          ? 'oklch(0.8 0.15 230)' 
          : 'oklch(0.3 0.15 230)',
        '--info-border': 'oklch(0.6 0.2 230)',
        
        '--warning-bg': currentTheme === 'dark' 
          ? 'oklch(0.15 0.15 80)' 
          : 'oklch(0.96 0.05 80)',
        '--warning-text': currentTheme === 'dark' 
          ? 'oklch(0.8 0.15 80)' 
          : 'oklch(0.3 0.15 80)',
        '--warning-border': 'oklch(0.6 0.2 80)',
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Toaster }
