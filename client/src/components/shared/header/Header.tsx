import React from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/theme/ThemeSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useStateStore from "@/store/store-index";
import { NavUser } from "../navbar/NavUser";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  className,
  children,
  ...props
}) => {
  const [offset, setOffset] = React.useState(0);
  const { profile } = useStateStore();

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    document.addEventListener("scroll", onScroll, { passive: true });

    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className={cn(
        "bg-card flex h-16 items-center gap-3 p-4 sm:gap-4 sticky top-0 z-50 justify-between",
        "border-b border-border/10 shadow-sm",
        offset > 10
          ? "shadow-md border-border/20"
          : "shadow-sm border-border/10",
        className
      )}
      {...props}
    >
      {/* Sidebar trigger is now passed as children from AppLayout */}

      {/* Search Component */}
      <div className="flex-1 max-w-sm flex items-center gap-2 flex-row">{children}</div>

      {/* Right side items */}
      <div className="flex items-center gap-6">
        <ThemeToggle />

        {/* Profile Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={
              profile?.profilePic ||
              "https://ui-avatars.com/api/?name=" +
                profile?.firstName +
                "+" +
                profile?.lastName
            }
            alt={profile?.firstName + " " + profile?.lastName || "User"}
          />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            {getUserInitials(profile?.firstName + " " + profile?.lastName)}
          </AvatarFallback>
        </Avatar>
        {/* {profile && (
					<NavUser 
						user={{
							name: profile.firstName + ' ' + profile.lastName || 'Unknown User',
							email: profile.email || 'unknown@example.com',
							avatar: profile.profilePic || 'https://ui-avatars.com/api/?name=' + profile.firstName + '+' + profile.lastName
						}} 
					/>
				)} */}
      </div>
    </header>
  );
};

export default Header;
