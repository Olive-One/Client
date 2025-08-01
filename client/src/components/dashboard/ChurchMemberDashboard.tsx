import React from 'react';
import { type UserData } from '@/types/user.types';
import { useDashboardStats, useRecentActivities, useFamilyStats } from '@/hooks/useDashboard';
import { formatDistanceToNow } from 'date-fns';
import { 
  Home, 
  Users, 
  Calendar, 
  Activity, 
  Heart, 
  Clock, 
  Star, 
  BookOpen,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChurchMemberDashboardProps {
  user: UserData;
}

const ChurchMemberDashboard: React.FC<ChurchMemberDashboardProps> = ({ user }) => {
  const { isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const { data: activitiesData, isLoading: activitiesLoading, isError: activitiesError } = useRecentActivities();
  const { data: familyStatsData, isLoading: familyStatsLoading, isError: familyStatsError } = useFamilyStats();

  const activities = activitiesData?.data || [];
  const familyStats = familyStatsData?.data || { familyMemberCount: 1, familyName: null, familyMembers: [] };

  const memberActivities = activities.slice(0, 5);

  const memberStatsCards = [
    {
      label: 'My Family Members',
      value: familyStats.familyMemberCount || 1,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Total family members',
    },
    {
      label: 'Events Attended',
      value: Math.floor(Math.random() * 15) + 5,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'This month',
    },
    {
      label: 'Community Score',
      value: Math.floor(Math.random() * 50) + 50,
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Participation level',
    },
    {
      label: 'Member Since',
      value: formatDistanceToNow(new Date(user.createdAt || new Date()), { addSuffix: false }),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Years of membership',
    },
  ];

  if (statsError || activitiesError || familyStatsError) {
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
      {/* Personal Information Header */}
      <Card className="border-l-4 border-l-purple-500 shadow-md border-0 dark-card-border">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 text-lg font-medium text-white">
              {user.firstName?.charAt(0)?.toUpperCase()}{user.lastName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-purple-600">
                {user.firstName} {user.lastName || ''}
              </h2>
              <p className="text-sm text-muted-foreground">
                My Church Family Dashboard
              </p>
              <div className="flex items-center space-x-2">
                <span className="inline-flex rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                  Church Member
                </span>
                {user.family && (
                  <span className="inline-flex rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {user.family.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Overview Stats */}
      <div>
        <div className="mb-4 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">My Overview</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {memberStatsCards.map((stat, index) => (
            <Card key={index} className="shadow-md border-0 dark-card-border">
              <CardContent className="p-6">
                <div className="space-y-3 text-center">
                  <div className={`mx-auto rounded-lg p-3 ${stat.bgColor} w-fit`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    {statsLoading || familyStatsLoading ? (
                      <div className="mx-auto h-6 w-16 animate-pulse rounded bg-gray-200" />
                    ) : (
                      <p className={`text-xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* My Church & Family Information */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Church Information */}
        <Card className="shadow-md border-0 dark-card-border">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Home className="mr-2 h-5 w-5" />
              My Church
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Diocese</p>
                <p className="font-medium">{user.diocese?.name || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Home className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Church</p>
                <p className="font-medium">{user.church?.name || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Home className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Family</p>
                <p className="font-medium">{user.family?.name || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-md border-0 dark-card-border">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { event: 'Sunday Mass', date: 'Tomorrow 9:00 AM', type: 'worship' },
              { event: 'Youth Group Meeting', date: 'Wed 7:00 PM', type: 'community' },
              { event: 'Bible Study', date: 'Fri 6:00 PM', type: 'study' },
              { event: 'Community Service', date: 'Sat 10:00 AM', type: 'service' },
            ].map((event, index) => (
              <div key={index} className="rounded-lg bg-gray-50 p-3">
                <div className="flex items-center space-x-3">
                  {event.type === 'worship' ? (
                    <Heart className="h-5 w-5 text-red-500" />
                  ) : event.type === 'study' ? (
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Users className="h-5 w-5 text-green-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {event.event}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div>
        <div className="mb-4 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-primary">My Recent Activities</h2>
        </div>
        <Card className="shadow-md border-0 dark-card-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {activitiesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded bg-gray-200" />
                ))
              ) : memberActivities.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No recent activities</p>
                </div>
              ) : (
                memberActivities.map((activity, index) => (
                  <div key={activity.id || index} className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-xs font-medium text-white">
                        {(activity.user || 'Unknown').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-gray-700">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
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
                    {index < memberActivities.length - 1 && (
                      <hr className="border-gray-200" />
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md border-0 dark-card-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" size="sm">
              Update Profile
            </Button>
            <Button variant="outline" size="sm">
              View Events
            </Button>
            <Button variant="outline" size="sm">
              Contact Family
            </Button>
            <Button variant="outline" size="sm">
              Volunteer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChurchMemberDashboard;