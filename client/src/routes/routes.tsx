import AppLayout from '@/components/shared/appLayout/AppLayout';
import PersistLogin from '@/components/shared/persistLogin/PersistLogin';
// import ErrorDisplay from '@/components/shared/errorDisplay/ErrorDisplay';
// import RoleGuard from '@/components/shared/utility/RoleGuard';
import { RoutePaths } from '@/constants/routePaths.constants';
import { Navigate, Route, useRouteError } from 'react-router-dom';
// import ChangePassword from '@/pages/ChangePassword';
// import ChurchesList from '@/pages/church/ChurchesList';
import Dashboard from '@/pages/Dashboard';
// import DiocesesList from '@/pages/diocese/DiocesesList';
// import FamiliesList from '@/pages/family/FamiliesList';
// import OrganizationsList from '@/pages/organization/OrganizationsList';
// import OrganizationDashboard from '@/pages/organization/OrganizationDashboard';
// import OrganizationMembership from '@/pages/organization/OrganizationMembership';
// import OrganizationLeadership from '@/pages/organization/OrganizationLeadership';
import Login from '@/pages/Login';
// import UserChangePassword from '@/pages/UserChangePassword';
// import UserProfilePage from '@/pages/profile/UserProfilePage';
// import UserRolesTable from '@/pages/super-admin/Roles/UserRoles';
// import Users from '@/pages/super-admin/users/Users';
// import OrganizationDetailLayout from '@/pages/organization/OrganizationDetailLayout';
import AuthenticateRoutes from '@/router/AuthenticateRoutes';

const ErrorBoundary = () => {
  useRouteError();
  return <div>Error</div>;
};

export const AuthenticatedRoutes = (
  <Route element={<PersistLogin />} errorElement={<ErrorBoundary />}>
    <Route element={<AuthenticateRoutes />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to={RoutePaths.LOGIN} replace />} />
        <Route
          path="dashboard"
          element={
            // <RoleGuard role={UserPermissions.DASHBOARD_READ} enableRedirect>
              <Dashboard />
            // </RoleGuard>
          }
        />
        {/* <Route path="/diocese">
          <Route index element={<Navigate to="/diocese/manage-dioceses" replace />} />
          <Route
            path="manage-dioceses"
            element={
              <RoleGuard role={UserPermissions.DASHBOARD_READ} enableRedirect>
                <DiocesesList />
              </RoleGuard>
            }
          />
        </Route>
        <Route path="/churches">
          <Route index element={<Navigate to="/churches/manage-churches" replace />} />
          <Route
            path="manage-churches"
            element={
              <RoleGuard role={UserPermissions.DASHBOARD_READ} enableRedirect>
                <ChurchesList />
            </RoleGuard>
            }
          />
        </Route>
        <Route path="/families">
          <Route index element={<Navigate to="/families/manage-families" replace />} />
          <Route
            path="manage-families"
            element={
              <RoleGuard role={UserPermissions.FAMILY_READ} enableRedirect>
                <FamiliesList />
              </RoleGuard>
            }
          />
        </Route>
        <Route path="/organizations">
          <Route index element={<Navigate to="/organizations/manage-organizations" replace />} />
          <Route
            path="manage-organizations"
            element={
              <RoleGuard role={UserPermissions.ORGANIZATION_READ} enableRedirect>
                <OrganizationsList />
              </RoleGuard>
            }
          />
          <Route
            path=":organizationId"
            element={
              <RoleGuard role={UserPermissions.ORGANIZATION_READ} enableRedirect>
                <OrganizationDetailLayout/>
              </RoleGuard>
            }
          >
            <Route
              path="dashboard"
              element={
                <RoleGuard role={UserPermissions.ORGANIZATION_READ} enableRedirect>
                  <OrganizationDashboard />
                </RoleGuard>
              }
            />
            <Route
              path="membership"
              element={
                <RoleGuard role={UserPermissions.ORGANIZATION_MANAGE_MEMBERS} enableRedirect>
                  <OrganizationMembership />
                </RoleGuard>
              }
            />
            <Route
              path="leadership"
              element={
                <RoleGuard role={UserPermissions.ORGANIZATION_MANAGE_LEADERSHIP} enableRedirect>
                  <OrganizationLeadership />
                </RoleGuard>
              }
            />
          </Route>
        </Route>
        <Route path="/admin">
          <Route element={<RoleGuard role={UserPermissions.ADMIN_READ} enableRedirect><Navigate to="/admin/users" replace /></RoleGuard>} />
          <Route
            path="users"
            element={
              <RoleGuard role={UserPermissions.USERS_READ} enableRedirect>
                <Users />
              </RoleGuard>
            }
          />
          <Route
            path="roles"
            element={
              <RoleGuard role={UserPermissions.ROLES_READ} enableRedirect>
                <UserRolesTable />
              </RoleGuard>
            }
          />
        </Route>
        <Route path="/user/:userId/profile">
          <Route
            index
            element={
              <RoleGuard role={UserPermissions.DASHBOARD_READ} enableRedirect>
                <UserProfilePage />
              </RoleGuard>
            }
          />
        </Route>
        <Route
          path="/change-password"
          element={
            <RoleGuard role={UserPermissions.DASHBOARD_READ} enableRedirect>
              <UserChangePassword />
            </RoleGuard>
          }
        /> */}
      </Route>
    </Route>
  </Route>
);

export const UnauthenticatedRoutes = (
  <Route>
    <Route element={<Login />} path="/login" />
    {/* <Route element={<ChangePassword />} path="change-temp-password" /> */}
  </Route>
);
