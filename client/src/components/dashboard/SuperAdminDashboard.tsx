import React from 'react';
import { type UserData } from '@/types/user.types';
import { useDashboardStats, useRecentActivities } from '@/hooks/useDashboard';
import { formatDistanceToNow } from 'date-fns';
import { 
  Home, 
  Users, 
  UserPlus, 
  TrendingUp, 
  Activity, 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  Building2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SuperAdminDashboardProps {
  user: UserData;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = () => {
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: activitiesData, isLoading: activitiesLoading, isError: activitiesError } = useRecentActivities();

  const stats = statsData?.data || {};
  const activities = activitiesData?.data || [];

  const statsCards = [
    {
      label: 'Total Dioceses',
      value: stats.totalDioceses || 0,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      changeType: 'increase' as const,
      changeValue: '+12%', // TODO: Add actual data
    },
    {
      label: 'Total Churches',
      value: stats.totalChurches || 0,
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      changeType: 'increase' as const,
      changeValue: '+8%', // TODO: Add actual data
    },
    {
      label: 'Total Families',
      value: stats.totalFamilies || 0,
      icon: Home,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      changeType: 'increase' as const,
      changeValue: '+15%',
    },
    {
      label: 'Total Members',
      value: stats.totalMembers || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      changeType: 'increase' as const,
      changeValue: '+23%', // TODO: Add actual data
    },
    {
      label: 'Active Members',
      value: stats.activeMembers || 0,
      icon: UserPlus,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      changeType: 'increase' as const,
      changeValue: '+18%', // TODO: Add actual data
    },
    {
      label: 'New This Month',
      value: stats.newMembersThisMonth || 0,
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      changeType: 'increase' as const,
      changeValue: '+45%', // TODO: Add actual data
    },
  ];

  if (statsError || activitiesError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="text-red-600">⚠️</div>
          <div className="ml-3">
            <p className="text-sm text-red-800">
              Failed to load dashboard data. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* System Overview Stats */}
      <div>
        <div className="mb-4 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">System Overview</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((stat, index) => (
            <Card key={index} className="shadow-md border-0 dark-card-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    {statsLoading ? (
                      <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                    ) : (
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value.toLocaleString()}
                      </p>
                    )}
                    <div className="flex items-center space-x-1">
                      {stat.changeType === 'increase' ? (
                        <ArrowUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {stat.changeValue} from last month
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Role Distribution */}
      {stats.roleDistribution && stats.roleDistribution.length > 0 && (
        <div>
          <div className="mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-primary">Role Distribution</h2>
          </div>
          <Card className="shadow-md border-0 dark-card-border">
            <CardContent className="p-6">
              <div className="space-y-4">
                {statsLoading ? (
                  <div className="h-16 animate-pulse rounded bg-gray-200" />
                ) : (
                  stats.roleDistribution.map((role, index) => {
                    const percentage = stats.totalMembers 
                      ? (role.count / stats.totalMembers) * 100 
                      : 0;
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">
                            {role.role}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                              {role.count.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {percentage.toFixed(1)}% of total members
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activities */}
      <div>
        <div className="mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Recent Activities</h2>
        </div>
        <Card className="shadow-md border-0 dark-card-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {activitiesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded bg-gray-200" />
                ))
              ) : activities.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No recent activities</p>
                </div>
              ) : (
                activities.slice(0, 10).map((activity, index) => (
                  <div key={activity.id || index} className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {(activity.user || 'Unknown').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-gray-700">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`rounded-md px-2 py-1 text-xs font-medium ${
                            activity.type === 'user_created' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {activity.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index < activities.length - 1 && (
                      <hr className="border-gray-200" />
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;