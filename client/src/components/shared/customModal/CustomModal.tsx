import React from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CustomModalProps {
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  contentStyles?: React.CSSProperties;
  bodyStyles?: React.CSSProperties;
  footerStyles?: React.CSSProperties;
  showCloseButton?: boolean;
  lineHeight?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
  size = 'md',
  contentStyles = {},
  lineHeight = '2.2rem',
  bodyStyles = {},
  footerStyles = {},
  subtitle,
  showCloseButton = true,
  ...rest
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'sm:max-w-sm';
      case 'md':
        return 'sm:max-w-md';
      case 'lg':
        return 'sm:max-w-lg';
      case 'xl':
        return 'sm:max-w-xl';
      default:
        return 'sm:max-w-md';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} {...rest}>
      <DialogContent 
        className={`${getSizeClass()} shadow-md border-0 dark-card-border`}
        style={contentStyles}
      >
        {title && (
          <DialogHeader className="relative">
            <DialogTitle 
              className="text-primary text-2xl font-semibold pr-8"
              style={{ lineHeight }}
            >
              {title}
            </DialogTitle>
            {subtitle && (
              <DialogDescription className="text-muted-foreground mt-2 text-base leading-relaxed">
                {subtitle}
              </DialogDescription>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-8 w-8 p-0 text-primary border border-primary rounded-full hover:bg-primary/10"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </DialogHeader>
        )}
        <div className="py-4" style={bodyStyles}>
          {children}
        </div>
        {footer && (
          <DialogFooter 
            className="bg-blue-50 dark:bg-blue-950/20 rounded-b-lg px-6 py-4 -mx-6 -mb-6"
            style={footerStyles}
          >
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;