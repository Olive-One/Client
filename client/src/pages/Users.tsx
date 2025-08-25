import { DataTable } from '@/components/shared/dataTable/DataTable';
import DateTimeDisplay from '@/components/shared/dateAndTimeDisplay/DateAndTimeDisplay';
import RoleGuard from '@/components/shared/utility/RoleGuard';
import { UserPermissions } from '@/constants/role.constants';
import { useDeleteUser, useDisableUser, useEnableUser, useFetchAllUsers } from '@/hooks/useUsers';
import { type UserData, type UserFilterCriteria, UserStatus } from '@/types/user.types';
import { CreateUser } from '@/components/User/CreateUser';
import { EditUser } from '@/components/User/EditUser';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { type SortingState, type PaginationState } from '@tanstack/react-table';
import OptionsMenu from '@/components/shared/OptionsMenu/OptionsMenu';
import EditIcon from '@/components/shared/icon/EditIcon';
import DeleteIcon from '@/components/shared/icon/DeleteIcon';
import DeactivateUserIcon from '@/components/shared/icon/DeactivateUserIcon';
import OperatorIcon from '@/components/shared/icon/OperatorIcon';
import ConfirmationModal from '@/components/shared/confirmationModal/ConfirmationModal';
import ConfirmationButtonGroup from '@/components/shared/confirmationModal/ConfirmationButtonGroup';
import { UserStatusMap } from '@/constants/user.constants';
import { DEFAULT_PAGINATION } from '@/constants/pagination.constants';
import SearchInput from '@/components/shared/searchField/SearchInput';
import { Users as UsersIcon, Plus } from 'lucide-react';

const columnHelper = createColumnHelper<UserData>();

const Users: React.FC = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION);
  const [filterCriteria, setFilterCriteria] = useState<UserFilterCriteria>({ search: '' });
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: activateUser } = useEnableUser();
  const { mutate: deactivateUser } = useDisableUser();

  const { data: userListApiResponse, isLoading: isTableDataFetching } = useFetchAllUsers({
    ...pagination,
    filters: filterCriteria,
    search: filterCriteria.search,
    sort: JSON.stringify(sorting),
  });

  const handleSearch = useCallback((value: string) => {
    setPagination(DEFAULT_PAGINATION);
    setFilterCriteria((prev) => ({ ...prev, search: value }));
  }, []);

  const handleEditClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedUserId(id);
        setIsEditModalOpen(true);
      }
    },
    []
  );

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    setSelectedUserId('');
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedUserId('');
  };

  const handleActivateUserClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedUserId(id);
        setIsActivateModalOpen(true);
      }
    },
    []
  );

  const handleDeactivateUserClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedUserId(id);
        setIsDeactivateModalOpen(true);
      }
    },
    []
  );

  const handleDeleteClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedUserId(id);
        setIsDeleteModalOpen(true);
      }
    },
    []
  );

  const handleDeleteUser = useCallback(() => {
    if (selectedUserId) {
      deleteUser(
        { id: selectedUserId },
        {
          onSuccess: () => {
            setIsDeleteModalOpen(false);
          },
        }
      );
    }
  }, [selectedUserId, deleteUser]);

  const handleActivateUser = useCallback(() => {
    if (selectedUserId) {
      activateUser(
        { userId: selectedUserId },
        {
          onSuccess: () => {
            setIsActivateModalOpen(false);
          },
        }
      );
    }
  }, [selectedUserId, activateUser]);

  const handleDeactivateUser = useCallback(() => {
    if (selectedUserId) {
      deactivateUser(
        { userId: selectedUserId },
        {
          onSuccess: () => {
            setIsDeactivateModalOpen(false);
          },
        }
      );
    }
  }, [selectedUserId, deactivateUser]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('firstName', {
        header: 'Name',
        cell: ({ row: { original } }) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm text-white font-medium">
                {original?.firstName?.charAt(0)}{original?.lastName?.charAt(0)}
              </span>
            </div>
            <span className="text-foreground">
              {original?.firstName} {original?.lastName}
            </span>
          </div>
        ),
      }),

      columnHelper.accessor('roles', {
        header: 'Role',
        cell: (info) => (
          <span className="text-foreground">
            {String(info?.row?.original?.roles?.[0]?.displayName)}
          </span>
        ),
      }),

      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row: { original } }) => (
          <span className="text-foreground">{original.email}</span>
        ),
      }),

      columnHelper.accessor('createdAt', {
        header: 'Date Created',
        cell: ({ row: { original } }) => {
          if (original.createdAt) {
            return <DateTimeDisplay dateTime={original.createdAt} />;
          }
          return <span className="text-muted-foreground">-</span>;
        },
      }),

      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const value = info.getValue() as UserStatus;
          const status = UserStatusMap[value];

          return (
            <Badge className={status?.className || 'bg-gray-100 text-gray-800'}>
              {status?.label}
            </Badge>
          );
        },
        enableSorting: false,
        meta: {
          headerAlign: 'center' as const,
          cellAlign: 'center' as const,
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
                role: UserPermissions.USERS_UPDATE,
              },
              {
                label: 'Delete User',
                action: handleDeleteClick(original.id),
                icon: <DeleteIcon />,
                role: UserPermissions.USERS_DELETE,
              },
              {
                label: 'Activate User',
                action: handleActivateUserClick(original.id),
                icon: <OperatorIcon />,
                role: UserPermissions.USERS_UPDATE,
                isDisabled: original.status === UserStatus.ACTIVE || original.status === UserStatus.TEMPORARY,
              },
              {
                label: 'Deactivate User',
                action: handleDeactivateUserClick(original.id),
                icon: <DeactivateUserIcon />,
                role: UserPermissions.USERS_UPDATE,
                isDisabled: original.status === UserStatus.INACTIVE || original.status === UserStatus.TEMPORARY,
              },
            ]}
          />
        ),
        meta: {
          headerAlign: 'center' as const,
          cellAlign: 'center' as const,
        },
      }),
    ],
    [handleEditClick, handleDeleteClick, handleActivateUserClick, handleDeactivateUserClick]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-4 py-4 lg:mx-12 lg:py-8 2xl:mx-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <UsersIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold text-primary">User Management</h1>
          </div>
          
          <RoleGuard role={UserPermissions.USERS_CREATE}>
            <Button onClick={handleCreateClick} className="w-fit">
              <Plus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </RoleGuard>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-md border-none">
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <SearchInput 
                placeholder="Search users..." 
                onSearch={handleSearch} 
                className="max-w-md"
              />
            </div>

            {/* Data Table */}
            <DataTable
              columns={columns as ColumnDef<UserData>[]}
              data={userListApiResponse?.data.rows || []}
              sorting={sorting}
              setSorting={setSorting}
              pagination={pagination}
              setPagination={setPagination}
              totalCount={userListApiResponse?.data.totalCount || 0}
              sortEnabledColumns={['firstName', 'email', 'createdAt']}
              isSortLoading={isTableDataFetching}
              emptyStateMessage="No users found. Try adjusting your search criteria."
            />
          </CardContent>
        </Card>

        {/* Confirmation Modals */}
        {isDeleteModalOpen && (
          <ConfirmationModal
            header="Are you sure you want to delete this user?"
            subHeader="This action cannot be undone."
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          >
            <ConfirmationButtonGroup 
              onCancel={() => setIsDeleteModalOpen(false)} 
              onSubmit={handleDeleteUser} 
              submitButtonText="Delete" 
              cancelButtonText="Cancel" 
            />
          </ConfirmationModal>
        )}

        {isActivateModalOpen && (
          <ConfirmationModal
            header="Are you sure you want to activate this user?"
            subHeader="This action will allow the user to access the system."
            isOpen={isActivateModalOpen}
            onClose={() => setIsActivateModalOpen(false)}
          >
            <ConfirmationButtonGroup 
              onCancel={() => setIsActivateModalOpen(false)} 
              onSubmit={handleActivateUser} 
              submitButtonText="Activate" 
              cancelButtonText="Cancel" 
            />
          </ConfirmationModal>
        )}

        {isDeactivateModalOpen && (
          <ConfirmationModal
            header="Are you sure you want to deactivate this user?"
            subHeader="This action will prevent the user from accessing the system."
            isOpen={isDeactivateModalOpen}
            onClose={() => setIsDeactivateModalOpen(false)}
          >
            <ConfirmationButtonGroup 
              onCancel={() => setIsDeactivateModalOpen(false)} 
              onSubmit={handleDeactivateUser} 
              submitButtonText="Deactivate" 
              cancelButtonText="Cancel" 
            />
          </ConfirmationModal>
        )}

        {/* Create User Modal */}
        <CreateUser 
          isOpen={isCreateModalOpen} 
          onClose={handleCreateModalClose} 
        />

        {/* Edit User Modal */}
        {selectedUserId && (
          <EditUser 
            isOpen={isEditModalOpen} 
            onClose={handleEditModalClose} 
            userId={selectedUserId}
          />
        )}
      </div>
    </div>
  );
};

export default Users;