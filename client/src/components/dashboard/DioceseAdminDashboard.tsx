import React from 'react';
import { type UserData } from '@/types/user.types';
import { useDashboardStats, useRecentActivities, useChurchStats } from '@/hooks/useDashboard';
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

interface DioceseAdminDashboardProps {
  user: UserData;
}

const DioceseAdminDashboard: React.FC<DioceseAdminDashboardProps> = ({ user }) => {
  const { isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: activitiesData, isLoading: activitiesLoading, isError: activitiesError } = useRecentActivities();
  const { data: churchStatsData, isLoading: churchStatsLoading, isError: churchStatsError } = useChurchStats();

  const activities = activitiesData?.data || [];
  const churchStats = churchStatsData?.data || { 
    churches: [], 
    totals: {
      totalChurches: 0,
      totalMembers: 0,
      totalActiveMembers: 0,
      totalFamilies: 0,
      totalNewMembersThisMonth: 0,
      averageGrowthPercentage: 0,
    }
  };

  const dioceseActivities = activities.slice(0, 6);

  const dioceseStatsCards = [
    {
      label: 'My Diocese Churches',
      value: churchStats.totals.totalChurches || 0,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      changeType: 'increase' as const,
      changeValue: '+5%',
    },
    {
      label: 'Diocese Families',
      value: churchStats.totals.totalFamilies || 0,
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      changeType: 'increase' as const,
      changeValue: '+12%',
    },
    {
      label: 'Diocese Members',
      value: churchStats.totals.totalMembers || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      changeType: 'increase' as const,
      changeValue: '+8%',
    },
    {
      label: 'Active Members',
      value: churchStats.totals.totalActiveMembers || 0,
      icon: UserPlus,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      changeType: 'increase' as const,
      changeValue: '+15%',
    },
    {
      label: 'New This Month',
      value: churchStats.totals.totalNewMembersThisMonth || 0,
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      changeType: 'increase' as const,
      changeValue: '+25%',
    },
    {
      label: 'Average Growth',
      value: `${churchStats.totals.averageGrowthPercentage || 0}%`,
      icon: Activity,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      changeType: 'increase' as const,
      changeValue: 'Diocese avg',
    },
  ];

  if (statsError || activitiesError || churchStatsError) {
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
      {/* Diocese Information Header */}
      <Card className="border-l-4 border-l-blue-500 shadow-md border-0 dark-card-border">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-blue-600">
                {user.diocese?.name || 'My Diocese'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Diocese Management Hub
              </p>
              <span className="inline-flex rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                Diocese Administrator
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diocese Overview Stats */}
      <div>
        <div className="mb-4 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Diocese Overview</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dioceseStatsCards.map((stat, index) => (
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
                    {statsLoading || churchStatsLoading ? (
                      <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                    ) : (
                      <p className={`text-2xl font-bold ${stat.color}`}>
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
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

      {/* Church Performance */}
      <div>
        <div className="mb-4 flex items-center">
          <Home className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Church Performance</h2>
        </div>
        <Card className="shadow-md border-0 dark-card-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {churchStatsLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded bg-gray-200" />
                ))
              ) : churchStats.churches.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No churches found in your diocese</p>
                </div>
              ) : (
                churchStats.churches.map((church, index) => (
                  <div key={church.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-700">{church.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {church.totalFamilies} families
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {church.totalMembers} members
                        </span>
                        <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                          {church.activeMembers} active
                        </span>
                        <span className={`rounded-md px-2 py-1 text-xs font-medium ${
                          church.growthPercentage > 10 
                            ? 'bg-green-100 text-green-800' 
                            : church.growthPercentage > 0 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {church.growthPercentage > 0 ? '+' : ''}{church.growthPercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full ${
                          church.growthPercentage > 10 
                            ? 'bg-green-600' 
                            : church.growthPercentage > 0 
                            ? 'bg-orange-600' 
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.max(0, church.growthPercentage)}%` }}
                      />
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>New this month: {church.newMembersThisMonth}</span>
                      <span>Total families: {church.totalFamilies}</span>
                    </div>
                    {index < churchStats.churches.length - 1 && (
                      <hr className="border-gray-200" />
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Diocese Activities */}
      <div>
        <div className="mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Recent Diocese Activities</h2>
        </div>
        <Card className="shadow-md border-0 dark-card-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {activitiesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded bg-gray-200" />
                ))
              ) : dioceseActivities.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No recent activities in your diocese</p>
                </div>
              ) : (
                dioceseActivities.slice(0, 8).map((activity, index) => (
                  <div key={activity.id || index} className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
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
                              : activity.type === 'church_created' 
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
                    {index < dioceseActivities.length - 1 && (
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

export default DioceseAdminDashboard;