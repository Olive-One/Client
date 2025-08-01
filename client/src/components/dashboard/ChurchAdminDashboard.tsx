import React from 'react';
import { type UserData } from '@/types/user.types';
import { useDashboardStats, useRecentActivities, useFamilyDistribution, useAgeGroupDistribution } from '@/hooks/useDashboard';
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
  Heart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ChurchAdminDashboardProps {
  user: UserData;
}

const ChurchAdminDashboard: React.FC<ChurchAdminDashboardProps> = ({ user }) => {
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: activitiesData, isLoading: activitiesLoading, isError: activitiesError } = useRecentActivities();
  const { data: familyDistributionData, isLoading: familyDistributionLoading, isError: familyDistributionError } = useFamilyDistribution();
  const { data: ageDistributionData, isLoading: ageDistributionLoading, isError: ageDistributionError } = useAgeGroupDistribution();

  const stats = statsData?.data || {};
  const activities = activitiesData?.data || [];
  const churchActivities = activities.slice(0, 8);

  const churchStatsCards = [
    {
      label: 'Church Families',
      value: stats.totalFamilies || 0,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      changeType: 'increase' as const,
      changeValue: '+3%',
    },
    {
      label: 'Church Members',
      value: stats.totalMembers || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      changeType: 'increase' as const,
      changeValue: '+7%',
    },
    {
      label: 'Active Members',
      value: stats.activeMembers || 0,
      icon: UserPlus,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      changeType: 'increase' as const,
      changeValue: '+12%',
    },
    {
      label: 'New This Month',
      value: stats.newMembersThisMonth || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      changeType: 'increase' as const,
      changeValue: '+18%',
    },
    {
      label: 'Average Family Size',
      value: Math.round((stats.averageFamilySize || 0) * 10) / 10,
      icon: Heart,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      changeType: 'increase' as const,
      changeValue: 'members/family',
    },
    {
      label: 'Inactive Members',
      value: stats.inactiveMembers || 0,
      icon: Calendar,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      changeType: 'decrease' as const,
      changeValue: 'to activate',
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
      {/* Church Information Header */}
      <Card className="border-l-4 border-l-green-500 shadow-md border-0 dark-card-border">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Home className="h-8 w-8 text-green-500" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-green-600">
                {user.church?.name || 'My Church'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Church Community Overview
              </p>
              <span className="inline-flex rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Church Administrator
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Church Overview Stats */}
      <div>
        <div className="mb-4 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Church Overview</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {churchStatsCards.map((stat, index) => (
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
                        {typeof stat.value === 'number' && stat.value % 1 !== 0 
                          ? stat.value.toFixed(1) 
                          : stat.value.toLocaleString()
                        }
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

      {/* Family Distribution */}
      <div>
        <div className="mb-4 flex items-center">
          <Home className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Family Distribution</h2>
        </div>
        <Card className="shadow-md border-0 dark-card-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {familyDistributionLoading ? (
                <div className="h-16 animate-pulse rounded bg-gray-200" />
              ) : familyDistributionError ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <div className="flex">
                    <div className="text-red-600">⚠️</div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">
                        Failed to load family distribution data
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                familyDistributionData?.data.distribution.map((family, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">
                        {family.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          {family.count} families
                        </span>
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {family.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-green-600"
                        style={{ width: `${family.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
              {familyDistributionData?.data.totalFamilies === 0 && (
                <p className="text-center italic text-muted-foreground">
                  No families found in this church
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Age Group Distribution */}
      <div>
        <div className="mb-4 flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Age Group Distribution</h2>
        </div>
        <Card className="shadow-md border-0 dark-card-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {ageDistributionLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-lg bg-gray-200" />
                ))
              ) : ageDistributionError ? (
                <div className="col-span-full">
                  <div className="rounded-md border border-red-200 bg-red-50 p-4">
                    <div className="flex">
                      <div className="text-red-600">⚠️</div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">
                          Failed to load age distribution data
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ageDistributionData?.data.distribution.map((group, index) => (
                  <div key={index} className={`rounded-lg p-4 bg-${group.color}-50`}>
                    <h3 className={`font-bold text-${group.color}-700 mb-2`}>
                      {group.group}
                    </h3>
                    <p className={`text-2xl font-bold text-${group.color}-600`}>
                      {group.count}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      members ({group.percentage}%)
                    </p>
                  </div>
                ))
              )}
              {ageDistributionData?.data.totalMembersWithAge === 0 && (
                <p className="col-span-full text-center italic text-muted-foreground">
                  No age data available for church members
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Church Activities */}
      <div>
        <div className="mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Recent Church Activities</h2>
        </div>
        <Card className="shadow-md border-0 dark-card-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {activitiesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded bg-gray-200" />
                ))
              ) : churchActivities.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No recent activities in your church</p>
                </div>
              ) : (
                churchActivities.map((activity, index) => (
                  <div key={activity.id || index} className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">
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
                              : activity.type === 'family_created' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-purple-100 text-purple-800'
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
                    {index < churchActivities.length - 1 && (
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

export default ChurchAdminDashboard;