import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';

interface AgeDistributionData {
  name: string;
  count: number;
  percentage: number;
}

interface AgeDistributionChartProps {
  data: AgeDistributionData[] | any;
  isLoading?: boolean;
}

// Helper function to process age distribution data into chart format
const processAgeDataForChart = (rawData: any): AgeDistributionData[] => {
  if (!rawData || !rawData.distribution || !Array.isArray(rawData.distribution)) {
    return [];
  }

  return rawData.distribution.map((ageGroup: any) => ({
    name: ageGroup.group || 'Unknown',
    count: parseInt(ageGroup.count) || 0,
    percentage: parseFloat(ageGroup.percentage) || 0
  }));
};

export const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({ 
  data = [], 
  isLoading = false 
}) => {
  const [showPercentages, setShowPercentages] = useState(true);

  // Process data based on input type
  const getChartData = (): AgeDistributionData[] => {
    if (Array.isArray(data) && data.length > 0 && Object.prototype.hasOwnProperty.call(data[0], 'name')) {
      return data; // Already processed data
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      return processAgeDataForChart(data); // Raw data from API
    }
    return [];
  };

  const chartData = getChartData();

  // Define distinct colors for each age group
  const ageColors = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber/Orange
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#ec4899', // Pink
    '#6b7280', // Gray
  ];

  // Generate colors for data items
  const dataWithColors = chartData.map((item, index) => ({
    ...item,
    fill: ageColors[index % ageColors.length]
  }));

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="animate-pulse bg-muted rounded h-full w-full" />
      </div>
    );
  }

  // Show empty state if no data
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">👥</p>
          <p>No age distribution data available</p>
          <p className="text-sm mt-1">Data will appear when members are registered</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: data.fill }}
                />
                <span className="text-sm">Members</span>
              </div>
              <span className="font-bold">{data.count}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Percentage</span>
              <span className="font-bold">{data.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Chart Options */}
      <div className="flex items-center justify-end flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-percentages"
            checked={showPercentages}
            onCheckedChange={(checked) => setShowPercentages(!!checked)}
          />
          <label 
            htmlFor="show-percentages" 
            className="text-sm font-medium cursor-pointer"
          >
            Show percentages
          </label>
        </div>
      </div>

      {/* Chart with Side Labels */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-8">
          {/* Pie Chart */}
          <div className="flex-shrink-0">
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={dataWithColors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Side Labels */}
          <div className="flex flex-col justify-center space-y-3">
            {dataWithColors.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.fill }}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.count}</span>
                    {showPercentages && (
                      <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 p-4 rounded-lg bg-muted/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{chartData.reduce((sum, item) => sum + item.count, 0)}</p>
            <p className="text-sm text-muted-foreground">Total Members</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{chartData.length}</p>
            <p className="text-sm text-muted-foreground">Age Groups</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{chartData.length > 0 ? Math.round(chartData.reduce((sum, item) => sum + item.count, 0) / chartData.length) : 0}</p>
            <p className="text-sm text-muted-foreground">Avg per Group</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export both for compatibility
export const FamilyDistributionChart = AgeDistributionChart;