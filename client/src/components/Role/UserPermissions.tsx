import React, { type Dispatch, type SetStateAction, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { type Permissions } from '@/types/role.types';

type PermissionsProps = {
  permissions: Permissions[];
  category: string;
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
};

const UserPermissions: React.FC<PermissionsProps> = ({ permissions, category, selectedIds, setSelectedIds }) => {
  const permissionIds = useMemo(() => permissions.map((p) => p.id), [permissions]);

  const checkedItems = useMemo(() => permissions.map((permission) => selectedIds.includes(permission.id)), [permissions, selectedIds]);

  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  const handleMainCheckboxChange = (isChecked: boolean) => {
    if (isChecked) {
      // Add all permission IDs in this category, avoiding duplicates
      setSelectedIds((prev) => Array.from(new Set([...prev, ...permissionIds])));
    } else {
      // Remove all permission IDs in this category
      setSelectedIds((prev) => prev.filter((id) => !permissionIds.includes(id)));
    }
  };

  const handleSubCheckboxChange = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds((prev) => Array.from(new Set([...prev, id])));
    } else {
      setSelectedIds((prev) => prev.filter((pid) => pid !== id));
    }
  };

  return (
    <div className="mb-4">
      <Collapsible>
        <div className="flex items-center space-x-2 p-2 border-0 rounded-t-lg bg-muted/50">
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-center w-6 h-6 hover:bg-muted rounded">
              <ChevronRight className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-90" />
            </button>
          </CollapsibleTrigger>
          <Checkbox
            checked={allChecked}
            onCheckedChange={handleMainCheckboxChange}
            className={isIndeterminate ? 'data-[state=checked]:bg-muted-foreground' : ''}
          />
          <span className="text-sm font-medium">
            {category.replace(/_/g, ' ')}
          </span>
        </div>
        <CollapsibleContent>
          <div className="border-0 rounded-b-lg p-4 bg-background">
            <div className="pl-8 space-y-2">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedIds.includes(permission.id)}
                    onCheckedChange={(checked) => handleSubCheckboxChange(permission.id, checked as boolean)}
                  />
                  <label className="text-sm cursor-pointer">
                    {permission.name.replace(/_/g, ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default UserPermissions;