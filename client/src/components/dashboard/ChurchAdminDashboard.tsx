import React from 'react';
import { type UserData } from '@/types/user.types';
import { useDashboardStats, useRecentActivities, useAgeGroupDistribution } from '@/hooks/useDashboard';
import { useCombinedFinancialMetrics } from '@/hooks/useGrowthMetrics';
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
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AgeDistributionChart } from './charts/AgeDistributionChart';
import { IncomeExpenseGrowthChart } from './charts/IncomeExpenseGrowthChart';
import type { IncomeExpenseGrowthData } from '@/types/growthMetrics.types';

interface ChurchAdminDashboardProps {
  user: UserData;
}

const ChurchAdminDashboard: React.FC<ChurchAdminDashboardProps> = ({ user }) => {
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: activitiesData, isLoading: activitiesLoading, isError: activitiesError } = useRecentActivities();
  // const { data: familyDistributionData, isLoading: familyDistributionLoading, isError: familyDistributionError } = useFamilyDistribution();
  const { data: ageDistributionData, isLoading: ageDistributionLoading, isError: ageDistributionError } = useAgeGroupDistribution();
  const { data: combinedFinancialData, isLoading: combinedFinancialLoading, isError: combinedFinancialError } = useCombinedFinancialMetrics();

  const stats = statsData?.data || {};
  const activities = activitiesData?.data || [];
  const churchActivities = activities.slice(0, 8);

  // Helper function to process raw backend data into chart format for income and expenses
  const processIncomeExpenseGrowthDataForChart = (rawData: IncomeExpenseGrowthData[]) => {
    // Check if rawData exists and is an array
    if (!rawData || !Array.isArray(rawData)) {
      return [];
    }
  
    // Helper function to format month for display
    const formatMonth = (monthKey: string): string => {
      const date = new Date(monthKey + '-01');
      return date.toLocaleDateString('en-US', { month: 'short' });
    };
  
    // Since data is already in the right format, just transform the month
    return rawData.map(item => ({
      month: formatMonth(item.month),
      income: item.income || 0,
      expense: item.expense || 0
    }));
  };

  const incomeExpenseChartData = combinedFinancialData ? processIncomeExpenseGrowthDataForChart(combinedFinancialData?.data) : [];

  const churchStatsCards = [
    {
      label: 'Church Members',
      value: stats.totalMembers || 280,
      icon: Users,
      changeType: 'increase' as const,
      changeValue: '+7%',
      description: 'from last month'
    },
    {
      label: 'Active Members',
      value: stats.activeMembers || 258,
      icon: UserPlus,
      changeType: 'increase' as const,
      changeValue: '+12%',
      description: 'from last month'
    },
    {
      label: 'Church Families',
      value: stats.totalFamilies || 85,
      icon: Home,
      changeType: 'increase' as const,
      changeValue: '+3%',
      description: 'from last month'
    },
    {
      label: 'New This Month',
      value: stats.newMembersThisMonth || 18,
      icon: TrendingUp,
      changeType: 'increase' as const,
      changeValue: '+18%',
      description: 'from last month'
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
      {/* Church Information Header */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Home className="h-8 w-8 text-primary" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-primary">
                {user.church?.name || 'My Church'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Church Community Overview
              </p>
              <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
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
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {churchStatsCards.map((stat, index) => (
            <Card key={index}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  {stat.label}
                </CardTitle>
                <stat.icon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="h-6 w-16 animate-pulse rounded bg-muted" />
                ) : (
                  <div className='text-2xl font-bold'>
                    {stat.value.toLocaleString()}
                  </div>
                )}
                <p className='text-xs text-muted-foreground flex items-center mt-1'>
                  {stat.changeType === 'increase' ? (
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  {stat.changeValue} {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Income Expense Growth Chart & Age Distribution Side by Side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Income Expense Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Growth Trends</CardTitle>
            <CardDescription>
              Cumulative income and expense trends over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <IncomeExpenseGrowthChart
              data={incomeExpenseChartData.length > 0 ? incomeExpenseChartData : []}
              isLoading={combinedFinancialLoading || statsLoading}
            />
            {combinedFinancialError && (
              <div className="mt-2 text-xs text-muted-foreground">
                ⚠️ Unable to load financial metrics data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Age Group Distribution</CardTitle>
            <CardDescription>
              Age demographics of church members
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AgeDistributionChart
              data={ageDistributionData?.data || []}
              isLoading={ageDistributionLoading}
            />
            {ageDistributionError && (
              <div className="mt-2 text-xs text-muted-foreground">
                ⚠️ Unable to load age distribution data
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Recent Church Activities */}
      <div>
        <div className="mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">Recent Church Activities</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest church activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activitiesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded bg-muted" />
                ))
              ) : churchActivities.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No recent activities in your church</p>
                </div>
              ) : (
                churchActivities.map((activity, index) => (
                  <div key={activity.id || index} className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {(activity.user || 'Unknown').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
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

export default ChurchAdminDashboard;