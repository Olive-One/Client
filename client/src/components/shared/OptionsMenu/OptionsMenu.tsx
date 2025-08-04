import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { UserPermissions } from '@/constants/role.constants';
import RoleGuard from '../utility/RoleGuard';

interface MenuItem {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  role?: UserPermissions;
  isDisabled?: boolean;
}

interface OptionsMenuProps {
  id: string;
  menuItems: MenuItem[];
}

export default function OptionsMenu({ menuItems }: OptionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {menuItems.map((item, index) => {
          const MenuItem = (
            <DropdownMenuItem
              key={index}
              onClick={item.action}
              disabled={item.isDisabled}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            </DropdownMenuItem>
          );

          if (item.role) {
            return (
              <RoleGuard key={index} role={item.role}>
                {MenuItem}
              </RoleGuard>
            );
          }

          return MenuItem;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}