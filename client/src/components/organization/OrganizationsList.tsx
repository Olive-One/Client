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
import CreateOrganization from "./CreateOrganization";
import EditOrganization from "./EditOrganization";
import OperatorIcon from "@/components/shared/icon/OperatorIcon";
import DeactivateUserIcon from "@/components/shared/icon/DeactivateUserIcon";
import {
  type Organization,
  OrganizationStatus,
  type OrganizationFilterCriteria,
  ORGANIZATION_TYPE_OPTIONS,
} from "@/types/organization.types";
import {
  useActivateOrganization,
  useDeleteOrganization,
  useDisableOrganization,
  useFetchAllOrganizations,
} from "@/hooks/useOrganizations";
import AsyncSelectDropdown, {
  type MultiSelectOption,
} from "@/components/shared/AsyncSelectDropdown/AsyncSelectDropDown";
import { usePermissions } from "@/hooks/shared/usePermissions";
import {
  useContextChurchDropdown,
  useContextDioceseDropdown,
} from "@/hooks/shared/useDropdownData";
import { Building2 as OrganizationsIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<Organization>();

const OrganizationsList: React.FC = () => {
  const { t } = useTranslation();
  const { isSuperAdmin, isDioceseAdmin, profile } = usePermissions();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(DEFAULT_PAGINATION);
  const [selectedDiocese, setSelectedDiocese] =
    useState<MultiSelectOption | null>(null);
  const [selectedChurch, setSelectedChurch] =
    useState<MultiSelectOption | null>(null);
  const [selectedType, setSelectedType] = useState<MultiSelectOption | null>(
    null
  );
  const [filterCriteria, setFilterCriteria] =
    useState<OrganizationFilterCriteria>({
      search: "",
      dioceseId: selectedDiocese?.id || null,
      churchId: selectedChurch?.id || null,
      type: (selectedType?.value as any) || null,
    });
  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const { mutate: deleteOrganization } = useDeleteOrganization();
  const { mutate: activateOrganization } = useActivateOrganization();
  const { mutate: deactivateOrganization } = useDisableOrganization();
  const { data: dioceseOptions } = useContextDioceseDropdown();
  const { data: churchOptions } = useContextChurchDropdown(
    isDioceseAdmin ? profile?.dioceseId : selectedDiocese?.id
  );

  const { data: OrganizationListApiResponse, isLoading: isTableDataFetching } =
    useFetchAllOrganizations({
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
        setSelectedOrganizationId(id);
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
    setSelectedOrganizationId("");
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedOrganizationId("");
  };

  const handleDeleteClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedOrganizationId(id);
        setIsDeleteModalOpen(true);
      }
    },
    []
  );

  const handleDeleteOrganization = useCallback(() => {
    if (selectedOrganizationId) {
      deleteOrganization(selectedOrganizationId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
        },
      });
    }
  }, [selectedOrganizationId, deleteOrganization]);

  const handleActivateOrganizationClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedOrganizationId(id);
        setIsActivateModalOpen(true);
      }
    },
    []
  );

  const handleDeactivateOrganizationClick = useCallback(
    (id: string) => () => {
      if (id) {
        setSelectedOrganizationId(id);
        setIsDeactivateModalOpen(true);
      }
    },
    []
  );

  const handleActivateOrganization = useCallback(() => {
    if (selectedOrganizationId) {
      activateOrganization(selectedOrganizationId, {
        onSuccess: () => {
          setIsActivateModalOpen(false);
        },
      });
    }
  }, [selectedOrganizationId, activateOrganization]);

  const handleDeactivateOrganization = useCallback(() => {
    if (selectedOrganizationId) {
      deactivateOrganization(selectedOrganizationId, {
        onSuccess: () => {
          setIsDeactivateModalOpen(false);
        },
      });
    }
  }, [selectedOrganizationId, deactivateOrganization]);

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

  const handleTypeChange = useCallback((event: MultiSelectOption | null) => {
    setSelectedType(event);
    setFilterCriteria((prev) => ({
      ...prev,
      type: (event?.value as any) || null,
    }));
  }, []);

  const getTypeLabel = (type: string) => {
    const typeOption = ORGANIZATION_TYPE_OPTIONS.find(
      (option) => option.value === type
    );
    return typeOption?.label || type;
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("organizations.name"),
        cell: ({ row: { original } }) => <span>{original?.name}</span>,
        size: 200,
      }),

      columnHelper.accessor("type", {
        header: t("organizations.type"),
        cell: ({ row: { original } }) => (
          <span>{getTypeLabel(original?.type)}</span>
        ),
        size: 150,
      }),

      columnHelper.accessor("church.name", {
        header: t("organizations.church"),
        cell: ({ row: { original } }) => <span>{original?.church?.name}</span>,
        size: 180,
      }),

      columnHelper.accessor("diocese.name", {
        header: t("organizations.diocese"),
        cell: ({ row: { original } }) => <span>{original?.diocese?.name}</span>,
        size: 180,
      }),

      columnHelper.accessor("leader", {
        header: t("organizations.leader"),
        cell: ({ row: { original } }) => (
          <span>
            {original?.leader?.firstName} {original?.leader?.lastName}
          </span>
        ),
        size: 160,
      }),

      columnHelper.accessor("memberCount", {
        header: t("organizations.members"),
        cell: ({ row: { original } }) => <span>{original?.memberCount}</span>,
        size: 100,
        meta: {
          headerAlign: "center" as const,
          cellAlign: "center" as const,
        },
      }),

      columnHelper.accessor("establishedDate", {
        header: t("organizations.establishedDate"),
        cell: ({ row: { original } }) => (
          <span>
            {new Date(original?.establishedDate).toLocaleDateString()}
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
                label: t("organizations.editOrganization"),
                action: handleEditClick(original.id),
                icon: <EditIcon />,
                role: UserPermissions.ORGANIZATION_UPDATE,
              },
              {
                label: t("organizations.deleteOrganization"),
                action: handleDeleteClick(original.id),
                icon: <DeleteIcon />,
                role: UserPermissions.ORGANIZATION_DELETE,
              },
              {
                label: t("organizations.enableOrganization"),
                action: handleActivateOrganizationClick(original.id),
                icon: <OperatorIcon />,
                role: UserPermissions.ORGANIZATION_UPDATE,
                isDisabled: original.status === OrganizationStatus.ACTIVE,
              },
              {
                label: t("organizations.disableOrganization"),
                action: handleDeactivateOrganizationClick(original.id),
                icon: <DeactivateUserIcon />,
                role: UserPermissions.ORGANIZATION_UPDATE,
                isDisabled: original.status === OrganizationStatus.INACTIVE,
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
      handleActivateOrganizationClick,
      handleDeactivateOrganizationClick,
    ]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-4 py-4 lg:mx-12 lg:py-8 2xl:mx-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <OrganizationsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold text-primary">
              {t("organizations.manageOrganizations")}
            </h1>
          </div>
          
          <RoleGuard role={UserPermissions.ORGANIZATION_CREATE}>
            <Button onClick={handleCreateClick} className="w-fit">
              <Plus className="w-4 h-4 mr-2" />
              {t("organizations.createOrganization")}
            </Button>
          </RoleGuard>
        </div>

        {/* Main Content Card */}
        <Card className="shadow-md border-none">
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4">
              <SearchInput 
                placeholder={t("searchInputLabel")} 
                onSearch={handleSearch} 
                className="max-w-md"
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isSuperAdmin && (
                  <div className="flex-1 min-w-0">
                    <AsyncSelectDropdown
                      name="diocese"
                      placeholder={t("churches.info.diocese")}
                      defaultOptions={dioceseOptions?.data || []}
                      value={selectedDiocese}
                      loadOptions={() =>
                        Promise.resolve(dioceseOptions?.data || [])
                      }
                      onChange={handleDioceseChange}
                      isClearable={true}
                    />
                  </div>
                )}
                {(isSuperAdmin || isDioceseAdmin) && (
                  <div className="flex-1 min-w-0">
                    <AsyncSelectDropdown
                      name="church"
                      placeholder={t("churches.info.church")}
                      defaultOptions={churchOptions?.data || []}
                      value={selectedChurch}
                      loadOptions={() =>
                        Promise.resolve(churchOptions?.data || [])
                      }
                      onChange={handleChurchChange}
                      isClearable={true}
                      isDisabled={isSuperAdmin && !selectedDiocese}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <AsyncSelectDropdown
                    name="type"
                    placeholder={t("organizations.type")}
                    defaultOptions={ORGANIZATION_TYPE_OPTIONS}
                    value={selectedType}
                    loadOptions={() =>
                      Promise.resolve(ORGANIZATION_TYPE_OPTIONS)
                    }
                    onChange={handleTypeChange}
                    isClearable={true}
                  />
                </div>
              </div>
            </div>

            {/* Data Table */}
            <DataTable
              columns={columns as ColumnDef<Organization>[]}
              data={OrganizationListApiResponse?.data.rows || []}
              sorting={sorting}
              setSorting={setSorting}
              pagination={pagination}
              setPagination={setPagination}
              totalCount={OrganizationListApiResponse?.data.totalCount || 0}
              sortEnabledColumns={
                OrganizationListApiResponse?.data?.sortEnabledColumns
              }
              isSortLoading={isTableDataFetching}
              emptyStateMessage="No organizations found. Try adjusting your search criteria."
            />
          </CardContent>
        </Card>

        {/* Modals */}
          {isEditModalOpen && (
            <EditOrganization
              isOpen={isEditModalOpen}
              onClose={handleEditModalClose}
              selectedOrganizationId={selectedOrganizationId}
            />
          )}
          {isCreateModalOpen && (
            <CreateOrganization
              isOpen={isCreateModalOpen}
              onClose={handleCreateModalClose}
            />
          )}
          {isDeleteModalOpen && (
            <ConfirmationModal
              header={t("organizations.OrganizationDeleteModalHeader")}
              subHeader={t("organizations.OrganizationDeleteModalSubHeader")}
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
            >
              <ConfirmationButtonGroup
                onSubmit={handleDeleteOrganization}
                onCancel={() => setIsDeleteModalOpen(false)}
                submitButtonText="Delete"
                cancelButtonText="Cancel"
              />
            </ConfirmationModal>
          )}
          {isActivateModalOpen && (
            <ConfirmationModal
              header={t("organizations.enableOrganizationHeader")}
              subHeader={t("organizations.enableOrganizationSubHeader")}
              isOpen={isActivateModalOpen}
              onClose={() => setIsActivateModalOpen(false)}
            >
              <ConfirmationButtonGroup
                onSubmit={handleActivateOrganization}
                onCancel={() => setIsActivateModalOpen(false)}
                submitButtonText={t("form.enable")}
                cancelButtonText={t("form.cancel")}
              />
            </ConfirmationModal>
          )}
          {isDeactivateModalOpen && (
            <ConfirmationModal
              header={t("organizations.disableOrganizationHeader")}
              subHeader={t("organizations.disableOrganizationSubHeader")}
              isOpen={isDeactivateModalOpen}
              onClose={() => setIsDeactivateModalOpen(false)}
            >
              <ConfirmationButtonGroup
                onSubmit={handleDeactivateOrganization}
                onCancel={() => setIsDeactivateModalOpen(false)}
                submitButtonText={t("form.disable")}
                cancelButtonText={t("form.cancel")}
              />
            </ConfirmationModal>
          )}
      </div>
    </div>
  );
};

export default OrganizationsList;
