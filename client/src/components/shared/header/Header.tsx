import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "@/constants/routePaths.constants";
// import UserProfile from '../userProfile/UserProfile';
import oliveOneLogoLight from "../../../assets/oliveone-logo-light.svg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuthentication";
import { ThemeToggle } from "@/theme/ThemeSelector";
import ConfirmationModal from "../confirmationModal/ConfirmationModal";
import ConfirmationButtonGroup from "../confirmationModal/ConfirmationButtonGroup";
// import LanguageSelector from '../LanguageSelector/LanguageSelector';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);


  const handleLogoutConfirm = () => {
    logout();
    onClose();
  };

  const handleLogout = () => {
    onOpen();
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between",
        "bg-card",
        "text-foreground",
        "py-6 px-4 md:px-8",
        "shadow-md",
        "h-20",
        "sticky top-0 z-50",
        "transition-colors duration-200"
      )}
    >
      <div className="flex items-center">
        <div
          className={cn(
            "cursor-pointer",
            "h-full sm:h-[60px]",
            "w-[100px] sm:w-[260px]",
            "mr-2",
            "overflow-hidden",
            "rounded-sm"
          )}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate(RoutePaths.DASHBOARD);
            }
          }}
          aria-label="Navigate to dashboard"
        >
          <img
            src={oliveOneLogoLight}
            alt="OliveOne Logo"
            // className="w-full h-full object-contain filter dark:invert dark:brightness-0 dark:contrast-100"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <ThemeToggle />        

        {/* Logout Button */}
        <Button 
        variant="outline"
          size="sm" 
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground hover:bg-accent w-9 h-9 p-0"
          aria-label="Logout"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </Button>

        {/* User Avatar */}
        <div className="h-8 w-8 bg-muted rounded-full border border-border flex items-center justify-center transition-colors">
          <svg
            className="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        header="Are you sure you want to logout"
        subHeader="You will be logged out of your account and redirected to the login page."
        showCloseButton={false}
      >
        <ConfirmationButtonGroup
          cancelButtonText="Cancel"
          submitButtonText="Logout"
          onCancel={onClose}
          onSubmit={handleLogoutConfirm}
        />
      </ConfirmationModal>
    </header>
  );
};

export default Header;