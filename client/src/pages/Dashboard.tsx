import React from 'react';
import { useCurrentUserProfile } from '@/hooks/useDashboard';
import { UserRoles } from '@/constants/role.constants';
import AppLoader from '@/components/shared/AppLoader';
import ErrorDisplay from '@/components/shared/errorDisplay/ErrorDisplay';
import SuperAdminDashboard from '@/components/dashboard/SuperAdminDashboard';
import DioceseAdminDashboard from '@/components/dashboard/DioceseAdminDashboard';
import ChurchAdminDashboard from '@/components/dashboard/ChurchAdminDashboard';
import ChurchMemberDashboard from '@/components/dashboard/ChurchMemberDashboard';
import { BarChart } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: profileData, isLoading, isError } = useCurrentUserProfile();

  if (isLoading) {
    return <AppLoader />;
  }

  if (isError || !profileData?.data) {
    return <ErrorDisplay message="We couldn't load your dashboard. Please try refreshing the page." />;
  }

  const user = profileData.data;
  const userRole = user.roles?.[0]?.displayName || user.roles?.[0]?.name || 'User';
  const userRoleName = user.roles?.[0]?.name || '';

  // Render role-specific dashboard
  const renderDashboard = () => {
    if (userRoleName === UserRoles.SUPER_ADMIN) {
      return <SuperAdminDashboard user={user} />;
    } else if (userRoleName === UserRoles.DIOCESE_ADMIN) {
      return <DioceseAdminDashboard user={user} />;
    } else if (userRoleName === UserRoles.CHURCH_ADMIN) {
      return <ChurchAdminDashboard user={user} />;
    } else if (userRoleName === UserRoles.CHURCH_MEMBER) {
      return <ChurchMemberDashboard user={user} />;
    } else {
      return (
        <div className="rounded-xl bg-card p-6 text-center shadow-sm">
          <p className="text-lg text-muted-foreground">
            Dashboard not available for your role.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-4 py-4 lg:mx-12 lg:py-8 2xl:mx-16">
        <div className="space-y-8">
          {/* Dashboard Header */}
          <div className="rounded-xl bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <BarChart className="h-8 w-8 text-primary" />
              <div className="space-y-1">
                <h1 className="text-lg font-semibold text-primary">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="text-sm text-muted-foreground">
                  {userRole} Dashboard -{' '}
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Role-specific Dashboard Content */}
          {renderDashboard()}

          {/* System Footer */}
          <div className="mt-8 border-t border-border pt-6">
            <div className="flex flex-wrap items-center justify-between space-y-4 sm:space-y-0">
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary">
                  Olive One
                </p>
                <p className="text-xs text-muted-foreground">
                  Church Management System
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs text-muted-foreground">
                  Powered by modern technology
                </p>
                <p className="text-xs text-muted-foreground">
                  © 2024 Olive One. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;