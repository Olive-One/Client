import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from './authentication/useAxioxPrivate';
import API_URLS from '@/services/apiUrls';
import { fetchData } from '@/services/api';

interface DashboardStats {
  totalDioceses?: number;
  totalChurches?: number;
  totalFamilies?: number;
  totalMembers?: number;
  activeMembers?: number;
  inactiveMembers?: number;
  newMembersThisMonth?: number;
  averageFamilySize?: number;
  roleDistribution?: Array<{ role: string; count: number }>;
}

interface GrowthTrend {
  month: string;
  members: number;
  families: number;
  churches?: number;
}

interface RecentActivity {
  id: string;
  type: 'user_created' | 'church_created' | 'family_created' | 'status_changed';
  description: string;
  timestamp: string;
  user?: string;
}

export interface ChurchStat {
  id: number;
  name: string;
  totalMembers: number;
  activeMembers: number;
  totalFamilies: number;
  newMembersThisMonth: number;
  growthPercentage: number;
  createdAt: string;
}

export interface ChurchStats {
  churches: ChurchStat[];
  totals: {
    totalChurches: number;
    totalMembers: number;
    totalActiveMembers: number;
    totalFamilies: number;
    totalNewMembersThisMonth: number;
    averageGrowthPercentage: number;
  };
}

interface FamilyMember {
  id: number;
  name: string;
  status: string;
}

interface FamilyStats {
  familyMemberCount: number;
  familyName: string | null;
  familyMembers: FamilyMember[];
}

interface FamilyDistribution {
  distribution: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  totalFamilies: number;
}

interface AgeGroupDistribution {
  distribution: Array<{
    group: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  totalMembersWithAge: number;
}

export function useDashboardStats() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => fetchData<{ success: boolean; data: DashboardStats }>(API_URLS.DASHBOARD.STATS, authAxiosInstance),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useGrowthTrends() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['dashboard', 'growth-trends'],
    queryFn: () => fetchData<{ success: boolean; data: GrowthTrend[] }>(API_URLS.DASHBOARD.GROWTH_TRENDS, authAxiosInstance),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useRecentActivities() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['dashboard', 'recent-activities'],
    queryFn: () => fetchData<{ success: boolean; data: RecentActivity[] }>(API_URLS.DASHBOARD.RECENT_ACTIVITIES, authAxiosInstance),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useChurchStats() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['dashboard', 'church-stats'],
    queryFn: () => fetchData<{ success: boolean; data: ChurchStats }>(API_URLS.DASHBOARD.CHURCH_STATS, authAxiosInstance),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useFamilyStats() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['dashboard', 'family-stats'],
    queryFn: () => fetchData<{ success: boolean; data: FamilyStats }>(API_URLS.DASHBOARD.FAMILY_STATS, authAxiosInstance),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useFamilyDistribution() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['dashboard', 'family-distribution'],
    queryFn: () => fetchData<{ success: boolean; data: FamilyDistribution }>(API_URLS.DASHBOARD.FAMILY_DISTRIBUTION, authAxiosInstance),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    refetchOnWindowFocus: false,
  });
}

export function useAgeGroupDistribution() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['dashboard', 'age-distribution'],
    queryFn: () => fetchData<{ success: boolean; data: AgeGroupDistribution }>(API_URLS.DASHBOARD.AGE_DISTRIBUTION, authAxiosInstance),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCurrentUserProfile() {
  const authAxiosInstance = useAxiosPrivate();
  return useQuery({
    queryKey: ['current-user-profile'],
    queryFn: () => fetchData<{ success: boolean; data: import('@/types/user.types').UserData }>(API_URLS.USER.PROFILE_ME, authAxiosInstance),
    staleTime: 0, // Don't cache to avoid stale data between different users
    gcTime: 0, // Don't keep in garbage collection
  });
}