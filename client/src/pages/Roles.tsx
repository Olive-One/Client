import React, { useCallback, useMemo, useState } from 'react';
import { DataTable } from '@/components/shared/dataTable/DataTable';
import DateTimeDisplay from '@/components/shared/dateAndTimeDisplay/DateAndTimeDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type ColumnDef, createColumnHelper, type SortingState, type PaginationState } from '@tanstack/react-table';
import OptionsMenu from '@/components/shared/OptionsMenu/OptionsMenu';
import EditIcon from '@/components/shared/icon/EditIcon';
import DeleteIcon from '@/components/shared/icon/DeleteIcon';
import ConfirmationModal from '@/components/shared/confirmationModal/ConfirmationModal';
import { useFetchAllUserRoles, useDeleteUserRole } from '@/hooks/useRoles';
import { type UserRoleFilterCriteria, type UserRoles } from '@/types/role.types';
import CreateRole from '@/components/Role/CreateRole';
import EditRole from '@/components/Role/EditRole';
import SearchInput from '@/components/shared/searchField/SearchInput';
import { DEFAULT_PAGINATION } from '@/constants/pagination.constants';

const columnHelper = createColumnHelper<UserRoles>();

const RolesPage: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION);
  const [filterCriteria, setFilterCriteria] = useState<UserRoleFilterCriteria>({ search: '' });
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutate: deleteRole } = useDeleteUserRole();

  const { data: userRolesList, isLoading: isRolesLoading } = useFetchAllUserRoles({
    ...pagination,
    filters: filterCriteria,
    search: filterCriteria.search || '',
    sort: JSON.stringify(sorting),
  });

  const handleSearch = useCallback((value: string) => {
    setPagination(DEFAULT_PAGINATION);
    setFilterCriteria((prev) => ({ ...prev, search: value }));
  }, []);

  const handleEditClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedRoleId(id);
        setIsEditModalOpen(true);
      }
    },
    []
  );

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleDeleteClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedRoleId(id);
        setIsDeleteModalOpen(true);
      }
    },
    []
  );

  const handleDeleteRole = useCallback(() => {
    if (selectedRoleId) {
      deleteRole(selectedRoleId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
        },
      });
    }
  }, [selectedRoleId, deleteRole]);

  const handleConfirmDelete = () => {
    handleDeleteRole();
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedRoleId('');
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row: { original } }) => (
          <span className="font-medium">{original?.name}</span>
        ),
      }),

      columnHelper.accessor('displayName', {
        header: 'Display Name',
        cell: ({ row: { original } }) => (
          <span>{original?.displayName}</span>
        ),
      }),

      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row: { original } }) => (
          <span className="text-muted-foreground">{original?.description}</span>
        ),
      }),

      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row: { original } }) => {
          if (original.createdAt) {
            return <DateTimeDisplay dateTime={original.createdAt} />;
          }
          return null;
        },
      }),

      columnHelper.display({
        id: 'options',
        header: 'Options',
        cell: ({ row: { original } }) => (
          <OptionsMenu
            id={original.id}
            menuItems={[
              {
                label: 'Edit',
                action: handleEditClick(original.id),
                icon: <EditIcon />,
              },
              {
                label: 'Delete',
                action: handleDeleteClick(original.id),
                icon: <DeleteIcon />,
              },
            ]}
          />
        ),
        meta: {
          headerAlign: 'center',
          cellAlign: 'center',
        },
      }),
    ],
    [handleEditClick, handleDeleteClick]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-8">
          <h1 className="text-3xl font-bold text-primary">
            Manage Roles
          </h1>
          <Button onClick={handleCreateClick}>
            Create Role
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4 gap-6">
            <SearchInput 
              placeholder="Search roles..." 
              onSearch={handleSearch} 
            />
          </div>
          
          <DataTable
            columns={columns as ColumnDef<UserRoles>[]}
            data={userRolesList?.data.rows || []}
            sorting={sorting}
            setSorting={setSorting}
            pagination={pagination}
            setPagination={setPagination}
            totalCount={userRolesList?.data?.totalCount || 0}
            sortEnabledColumns={userRolesList?.data?.sortEnabledColumns}
            isSortLoading={isRolesLoading}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Create Role Modal */}
      {isCreateModalOpen && (
        <CreateRole 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      )}

      {/* Edit Role Modal */}
      {isEditModalOpen && (
        <EditRole 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          roleId={selectedRoleId}
        />
      )}
    </div>
  );
};

export default RolesPage;