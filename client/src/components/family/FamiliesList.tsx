import { DataTable } from "@/components/shared/dataTable/DataTable";
import RoleGuard from "@/components/shared/utility/RoleGuard";
import { UserPermissions } from "@/constants/role.constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { type SortingState, type PaginationState } from "@tanstack/react-table";
import OptionsMenu from "@/components/shared/OptionsMenu/OptionsMenu";
import EditIcon from "@/components/shared/icon/EditIcon";
import DeleteIcon from "@/components/shared/icon/DeleteIcon";
import { useTranslation } from "react-i18next";
import ConfirmationModal from "@/components/shared/confirmationModal/ConfirmationModal";
import ConfirmationButtonGroup from "@/components/shared/confirmationModal/ConfirmationButtonGroup";
import { UserStatusMap } from "@/constants/user.constants";
import { DEFAULT_PAGINATION } from "@/constants/pagination.constants";
import SearchInput from "@/components/shared/searchField/SearchInput";
import CreateFamily from "./CreateFamily";
import EditFamily from "./EditFamily";
import OperatorIcon from "@/components/shared/icon/OperatorIcon";
import DeactivateUserIcon from "@/components/shared/icon/DeactivateUserIcon";
import {
  type Family,
  FamilyStatus,
  type FamilyFilterCriteria,
} from "@/types/family.types";
import {
  useActivateFamily,
  useDeleteFamily,
  useDisableFamily,
  useFetchAllFamilies,
} from "@/hooks/useFamilies";
import AsyncSelectDropdown, {
  type MultiSelectOption,
} from "@/components/shared/AsyncSelectDropdown/AsyncSelectDropDown";
import { usePermissions } from "@/hooks/shared/usePermissions";
import {
  useContextChurchDropdown,
  useContextDioceseDropdown,
} from "@/hooks/shared/useDropdownData";
import { Users as FamiliesIcon, Plus, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<Family>();

const FamiliesList: React.FC = () => {
  const { t } = useTranslation();
  const { isSuperAdmin, isDioceseAdmin, profile } = usePermissions();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(DEFAULT_PAGINATION);
  const [selectedDiocese, setSelectedDiocese] =
    useState<MultiSelectOption | null>(null);
  const [selectedChurch, setSelectedChurch] =
    useState<MultiSelectOption | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<FamilyFilterCriteria>({
    search: "",
    dioceseId: selectedDiocese?.id || null,
    churchId: selectedChurch?.id || null,
  });
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const { mutate: deleteFamily } = useDeleteFamily();
  const { mutate: activateFamily } = useActivateFamily();
  const { mutate: deactivateFamily } = useDisableFamily();
  const { data: dioceseOptions } = useContextDioceseDropdown();
  const { data: churchOptions } = useContextChurchDropdown(
    isDioceseAdmin ? profile?.dioceseId : selectedDiocese?.id
  );

  const { data: FamilyListApiResponse, isLoading: isTableDataFetching } =
    useFetchAllFamilies({
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
        setSelectedFamilyId(id);
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
    setSelectedFamilyId("");
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedFamilyId("");
  };

  const handleDeleteClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedFamilyId(id);
        setIsDeleteModalOpen(true);
      }
    },
    []
  );

  const handleDeleteFamily = useCallback(() => {
    if (selectedFamilyId) {
      deleteFamily(selectedFamilyId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
        },
      });
    }
  }, [selectedFamilyId, deleteFamily]);

  const handleActivateFamilyClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedFamilyId(id);
        setIsActivateModalOpen(true);
      }
    },
    []
  );

  const handleDeactivateFamilyClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedFamilyId(id);
        setIsDeactivateModalOpen(true);
      }
    },
    []
  );

  const handleActivateFamily = useCallback(() => {
    if (selectedFamilyId) {
      activateFamily(selectedFamilyId, {
        onSuccess: () => {
          setIsActivateModalOpen(false);
        },
      });
    }
  }, [selectedFamilyId, activateFamily]);

  const handleDeactivateFamily = useCallback(() => {
    if (selectedFamilyId) {
      deactivateFamily(selectedFamilyId, {
        onSuccess: () => {
          setIsDeactivateModalOpen(false);
        },
      });
    }
  }, [selectedFamilyId, deactivateFamily]);

  const handleDioceseChange = useCallback((value: MultiSelectOption | null) => {
    if (!value) {
      setSelectedDiocese(value);
      setSelectedChurch(null);
    }
    setSelectedDiocese(value);
    setSelectedChurch(null);
    setFilterCriteria((prev) => ({
      ...prev,
      dioceseId: value?.id ? value.id : null,
    }));
  }, []);

  const handleChurchChange = useCallback((value: MultiSelectOption | null) => {
    if (!value) {
      setSelectedChurch(null);
    }
    setSelectedChurch(value);
    setFilterCriteria((prev) => ({
      ...prev,
      churchId: value?.id ? value.id : null,
    }));
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("families.name"),
        cell: ({ row: { original } }) => (
          <span className="text-foreground font-medium">{original?.name}</span>
        ),
        size: 200,
      }),

      columnHelper.accessor("church.name", {
        header: t("families.church"),
        cell: ({ row: { original } }) => (
          <span className="text-foreground">{original?.church?.name}</span>
        ),
        size: 180,
      }),

      columnHelper.accessor("diocese.name", {
        header: t("families.diocese"),
        cell: ({ row: { original } }) => (
          <span className="text-foreground">{original?.diocese?.name}</span>
        ),
        size: 180,
      }),

      columnHelper.accessor("headOfFamily", {
        header: t("families.headOfFamily"),
        cell: ({ row: { original } }) => (
          <span className="text-foreground">
            {original?.headOfFamily?.firstName}{" "}
            {original?.headOfFamily?.lastName}
          </span>
        ),
        size: 160,
      }),

      columnHelper.accessor("address", {
        header: t("families.address"),
        cell: ({ row: { original } }) => (
          <span className="text-foreground truncate max-w-[200px]" title={`${original?.address?.firstLine} ${original?.address?.secondLine}`}>
            {original?.address?.firstLine} {original?.address?.secondLine}
          </span>
        ),
        size: 200,
      }),

      columnHelper.accessor("memberCount", {
        header: t("families.members"),
        cell: ({ row: { original } }) => (
          <span className="text-foreground">{original?.memberCount}</span>
        ),
        size: 100,
        meta: {
          headerAlign: "center" as const,
          cellAlign: "center" as const,
        },
      }),

      columnHelper.accessor("registrationDate", {
        header: t("families.registrationDate"),
        cell: ({ row: { original } }) => (
          <span className="text-foreground">
            {new Date(original?.registrationDate).toLocaleDateString()}
          </span>
        ),
        size: 140,
      }),

      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const status = UserStatusMap[value];

          return (
            <Badge
              variant={"outline"}
              className={cn(
                status?.bgColor,
                "text-inherit rounded-xl px-7 py-1"
              )}
            >
              {status?.label}
            </Badge>
          );
        },
        size: 120,
        enableSorting: false,
        meta: {
          headerAlign: "center" as const,
          cellAlign: "center" as const,
        },
      }),

      columnHelper.display({
        id: "options",
        header: "Options",
        cell: ({ row: { original } }) => (
          <OptionsMenu
            id={original.id}
            menuItems={[
              {
                label: t("families.editFamily"),
                action: handleEditClick(original.id),
                icon: <EditIcon />,
                role: UserPermissions.FAMILY_UPDATE,
              },
              {
                label: t("families.deleteFamily"),
                action: handleDeleteClick(original.id),
                icon: <DeleteIcon />,
                role: UserPermissions.FAMILY_DELETE,
              },
              {
                label: t("families.enableFamily"),
                action: handleActivateFamilyClick(original.id),
                icon: <OperatorIcon />,
                role: UserPermissions.FAMILY_UPDATE,
                isDisabled: original.status === FamilyStatus.ACTIVE,
              },
              {
                label: t("families.disableFamily"),
                action: handleDeactivateFamilyClick(original.id),
                icon: <DeactivateUserIcon />,
                role: UserPermissions.FAMILY_UPDATE,
                isDisabled: original.status === FamilyStatus.INACTIVE,
              },
            ]}
          />
        ),
        size: 100,
        meta: {
          headerAlign: "center" as const,
          cellAlign: "center" as const,
        },
      }),
    ],
    [
      t,
      handleEditClick,
      handleDeleteClick,
      handleActivateFamilyClick,
      handleDeactivateFamilyClick,
    ]
  );

  return (
    <div className="h-full w-full">
      <div className="p-4 sm:p-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <UsersIcon className="h-8 w-8 text-primary flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl font-semibold text-primary truncate">Family Management</h1>
        </div>
        
        <RoleGuard role={UserPermissions.USERS_CREATE}>
          <Button onClick={handleCreateClick} className="w-fit flex-shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Family
          </Button>
        </RoleGuard>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-md border-none w-full min-w-0">
        <CardContent className="w-full min-w-0 overflow-hidden p-4 sm:p-6">
          {/* Search */}
          <div className="mb-6">
            <SearchInput 
              placeholder="Search families..." 
              onSearch={handleSearch} 
              className="max-w-md"
            />
          </div>

          {/* Data Table */}
          <div>
            <DataTable
                columns={columns as ColumnDef<Family>[]}
                data={FamilyListApiResponse?.data.rows || []}
                sorting={sorting}
                setSorting={setSorting}
                pagination={pagination}
                setPagination={setPagination}
                totalCount={FamilyListApiResponse?.data.totalCount || 0}
                sortEnabledColumns={
                  FamilyListApiResponse?.data?.sortEnabledColumns
                }
                isSortLoading={isTableDataFetching}
                emptyStateMessage="No families found. Try adjusting your search criteria."
              />
          </div>
          
        </CardContent>
      </Card>
        
        {/* Confirmation Modals */}
        {isDeleteModalOpen && (
          <ConfirmationModal
            header="Are you sure you want to delete this family?"
            subHeader="This action cannot be undone."
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          >
            <ConfirmationButtonGroup
              onCancel={() => setIsDeleteModalOpen(false)}
              onSubmit={handleDeleteFamily}
              submitButtonText="Delete"
              cancelButtonText="Cancel"
            />
          </ConfirmationModal>
        )}

        {isActivateModalOpen && (
          <ConfirmationModal
            header="Are you sure you want to activate this family?"
            subHeader="This action will allow the family to access the system."
            isOpen={isActivateModalOpen}
            onClose={() => setIsActivateModalOpen(false)}
          >
            <ConfirmationButtonGroup
              onCancel={() => setIsActivateModalOpen(false)}
              onSubmit={handleActivateFamily}
              submitButtonText="Activate"
              cancelButtonText="Cancel"
            />
          </ConfirmationModal>
        )}

        {isDeactivateModalOpen && (
          <ConfirmationModal
            header="Are you sure you want to deactivate this family?"
            subHeader="This action will prevent the family from accessing the system."
            isOpen={isDeactivateModalOpen}
            onClose={() => setIsDeactivateModalOpen(false)}
          >
            <ConfirmationButtonGroup
              onCancel={() => setIsDeactivateModalOpen(false)}
              onSubmit={handleDeactivateFamily}
              submitButtonText="Deactivate"
              cancelButtonText="Cancel"
            />
          </ConfirmationModal>
        )}

        {/* Create Family Modal */}
        <CreateFamily
          isOpen={isCreateModalOpen}
          onClose={handleCreateModalClose}
        />

        {/* Edit Family Modal */}
        {selectedFamilyId && (
          <EditFamily
            isOpen={isEditModalOpen}
            onClose={handleEditModalClose}
            selectedFamilyId={selectedFamilyId}
          />
        )}
      </div>
    </div>
  );
};

export default FamiliesList;
