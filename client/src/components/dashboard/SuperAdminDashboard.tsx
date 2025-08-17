import React from 'react';
import { type UserData } from '@/types/user.types';
import { useDashboardStats, useRecentActivities } from '@/hooks/useDashboard';
import { useGrowthMetrics } from '@/hooks/useGrowthMetrics';
import { formatDistanceToNow } from 'date-fns';
import { 
  Home, 
  Users, 
  UserPlus, 
  Activity, 
  ArrowUp, 
  ArrowDown,
  Building2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MonthlyGrowthChart } from './charts/MonthlyGrowthChart';

interface SuperAdminDashboardProps {
  user: UserData;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = () => {
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: activitiesData, isLoading: activitiesLoading, isError: activitiesError } = useRecentActivities();
  const { data: growthData, isLoading: growthLoading, isError: growthError } = useGrowthMetrics();

  const stats = statsData?.data || {};
  const activities = activitiesData?.data || [];
  
  // Process growth data to match the actual backend response format
  const processedGrowthData = growthData?.data ? {
    dioceses: growthData.data.dioceses || [],
    churches: growthData.data.churches || [],
    users: growthData.data.users || []
  } : null;
  // Helper function to process raw backend data into chart format
  const processGrowthDataForChart = (rawData: any) => {
    if (!rawData || !rawData.dioceses || !rawData.churches || !rawData.users) {
      return [];
    }

    // Get all unique months from all data sources
    const allMonths = new Set<string>();
    rawData.dioceses.forEach((item: any) => allMonths.add(item.month_key));
    rawData.churches.forEach((item: any) => allMonths.add(item.month_key));
    rawData.users.forEach((item: any) => allMonths.add(item.month_key));

    // Sort months chronologically
    const sortedMonths = Array.from(allMonths).sort();

    // Helper function to format month for display
    const formatMonth = (monthKey: string): string => {
      const date = new Date(monthKey + '-01');
      return date.toLocaleDateString('en-US', { month: 'short' });
    };

    // Process cumulative data for each month
    let cumulativeDioceses = 0;
    let cumulativeChurches = 0;
    let cumulativeUsers = 0;

    return sortedMonths.map(monthKey => {
      // Find data for this month
      const dioceseData = rawData.dioceses.find((item: any) => item.month_key === monthKey);
      const churchData = rawData.churches.find((item: any) => item.month_key === monthKey);
      const userData = rawData.users.find((item: any) => item.month_key === monthKey);

      // Add to cumulative totals
      cumulativeDioceses += parseInt(dioceseData?.count || '0');
      cumulativeChurches += parseInt(churchData?.count || '0');
      cumulativeUsers += parseInt(userData?.count || '0');

      return {
        month: formatMonth(monthKey),
        dioceses: cumulativeDioceses,
        churches: cumulativeChurches,
        members: cumulativeUsers
      };
    });
  };

  const chartData = processedGrowthData ? processGrowthDataForChart(processedGrowthData) : [];

  const statsCards = [
    {
      label: 'Total Dioceses',
      value: stats.totalDioceses || 2,
      icon: Building2,
      changeType: 'increase' as const,
      changeValue: '+100%',
    },
    {
      label: 'Total Churches',
      value: stats.totalChurches || 2,
      icon: Home,
      changeType: 'increase' as const,
      changeValue: '+100%',
    },
    {
      label: 'Total Families',
      value: stats.totalFamilies || 15,
      icon: Users,
      changeType: 'increase' as const,
      changeValue: '+25%',
    },
    {
      label: 'Total Members',
      value: stats.totalMembers || 45,
      icon: UserPlus,
      changeType: 'increase' as const,
      changeValue: '+50%',
    },
  ];

  if (statsError || activitiesError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex">
          <div className="text-destructive">⚠️</div>
          <div className="ml-3">
            <p className="text-sm text-destructive">
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
          <h2 className="text-lg font-semibold text-primary">
            System Overview
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  <div className="text-2xl font-bold">
                    {stat.value.toLocaleString()}
                  </div>
                )}
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {stat.changeType === "increase" ? (
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {stat.changeValue} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Monthly Growth Chart & Recent Activities Side by Side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Monthly Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth Trends</CardTitle>
            <CardDescription>
              Cumulative growth of dioceses, churches, and members based on registration dates
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <MonthlyGrowthChart
              data={chartData.length > 0 ? chartData : []}
              isLoading={growthLoading || statsLoading}
            />
            {growthError && (
              <div className="mt-2 text-xs text-muted-foreground">
                ⚠️ Unable to load growth metrics data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest system activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitiesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-16 animate-pulse rounded bg-muted"
                  />
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
                        {(activity.user || "Unknown").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{activity.description}</p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`rounded-md px-2 py-1 text-xs font-medium ${
                              activity.type === "user_created"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {activity.type.replace("_", " ")}
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
                      <hr className="border-border" />
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