import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { type UserRoles } from '@/types/role.types';

interface ChildRolesProps {
  childRoles: UserRoles[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}

const ChildRoles: React.FC<ChildRolesProps> = ({
  childRoles,
  selectedIds,
  setSelectedIds,
}) => {
  const handleRoleToggle = (roleId: string) => {
    if (selectedIds.includes(roleId)) {
      setSelectedIds(selectedIds.filter(id => id !== roleId));
    } else {
      setSelectedIds([...selectedIds, roleId]);
    }
  };
  if (childRoles.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">No child roles available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="space-y-2">
          
          <div className=" gap-3">
            {childRoles.map((role) => (
              <div key={role.id} className="flex items-start space-x-2 space-y-5">
                <Checkbox
                  id={role.id}
                  checked={selectedIds.includes(role.id)}
                  onCheckedChange={() => handleRoleToggle(role.id)}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    width: '25px',
                    height: '25px',
                  }}
                />
                <div className="leading-none">
                  <label
                    htmlFor={role.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {role.displayName}
                  </label>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildRoles;