import { type FC } from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  thickness?: string;
  speed?: string;
  text?: string;
  className?: string;
  textClassName?: string;
  containerClassName?: string;
}

const AppLoader: FC<LoaderProps> = ({
  size = 'xl',
  color = 'hsl(var(--primary))',
  thickness = '4px',
  speed = '0.65s',
  text = 'Loading...',
  className,
  textClassName,
  containerClassName,
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const spinnerStyle = {
    borderWidth: thickness,
    borderStyle: 'solid',
    borderColor: `${color}20`, // 20% opacity for empty color
    borderTopColor: color,
    borderRadius: '50%',
    animation: `spin ${speed} linear infinite`,
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div
        className={cn(
          "fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50",
          containerClassName
        )}
      >
        <div
          className={cn(
            sizeClasses[size],
            className
          )}
          style={spinnerStyle}
        />
        {text && (
          <p
            className={cn(
              "mt-4 text-lg font-semibold text-foreground",
              textClassName
            )}
          >
            {text}
          </p>
        )}
      </div>
    </>
  );
};

export default AppLoader;