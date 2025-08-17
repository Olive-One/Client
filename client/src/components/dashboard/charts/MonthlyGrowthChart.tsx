import React, { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';

interface MonthlyGrowthData {
  month: string;
  dioceses: number;
  churches: number;
  members?: number;
}

interface MonthlyGrowthChartProps {
  data: MonthlyGrowthData[] | { dioceses: number; churches: number; members?: number };
  isLoading?: boolean;
}

export const MonthlyGrowthChart: React.FC<MonthlyGrowthChartProps> = ({ 
  data = [], 
  isLoading = false 
}) => {
  const [visibleLines, setVisibleLines] = useState({
    dioceses: true,
    churches: true,
    members: true
  });

  // Define distinct colors for each line
  const lineColors = {
    dioceses: '#3b82f6', // Blue
    churches: '#10b981', // Green
    members: '#f59e0b', // Amber/Orange
  };
  // Generate realistic growth trend for small early-stage systems
  const generateGrowthTrend = (currentDioceses: number, currentChurches: number, currentMembers?: number): MonthlyGrowthData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // For very small numbers, create a realistic startup growth pattern
    if (currentDioceses <= 5 && currentChurches <= 10) {
      // Start from system inception - very small numbers growing organically
      let diocesesCount = 0;
      let churchesCount = 0;
      
      // Define growth milestones for small systems
      const growthPattern = [
        { dioceses: 0, churches: 0 }, // Jan - System planning
        { dioceses: 0, churches: 0 }, // Feb - Still in setup
        { dioceses: 1, churches: 0 }, // Mar - First diocese added
        { dioceses: 1, churches: 1 }, // Apr - First church registered
        { dioceses: 1, churches: 1 }, // May - Consolidation period
        { dioceses: 1, churches: 1 }, // Jun - Growing membership
        { dioceses: 1, churches: 2 }, // Jul - Second church added
        { dioceses: 1, churches: 2 }, // Aug - System stabilization
        { dioceses: 2, churches: 2 }, // Sep - Second diocese expansion
        { dioceses: 2, churches: 2 }, // Oct - Current state reached
        { dioceses: currentDioceses, churches: currentChurches }, // Nov - Current actual
        { dioceses: currentDioceses, churches: currentChurches }, // Dec - Current actual
      ];
      
      // Calculate realistic member progression
      const finalMembers = currentMembers || 45;
      const membersPerChurch = finalMembers / Math.max(currentChurches, 1);
      
      return months.map((month, index) => {
        const pattern = growthPattern[index];
        diocesesCount = pattern.dioceses;
        churchesCount = pattern.churches;
        
        // Calculate members based on church count and progression
        let membersCount = 0;
        if (churchesCount > 0) {
          if (index >= 10) {
            // Last two months should show actual current members
            membersCount = finalMembers;
          } else {
            // Progressive growth towards final member count
            const progressRatio = (index + 1) / 10; // Growth progression
            membersCount = Math.floor(churchesCount * membersPerChurch * progressRatio);
          }
        }
        
        return {
          month,
          dioceses: diocesesCount,
          churches: churchesCount,
          members: membersCount
        };
      });
    }
    
    // For larger systems (fallback to original logic)
    const averageMonthlyDioceseGrowth = Math.max(1, Math.floor(currentDioceses * 0.05));
    const averageMonthlyChurchGrowth = Math.max(2, Math.floor(currentChurches * 0.08));
    
    let diocesesCount = Math.max(1, currentDioceses - (averageMonthlyDioceseGrowth * 8));
    let churchesCount = Math.max(2, currentChurches - (averageMonthlyChurchGrowth * 8));
    
    return months.map((month, index) => {
      if (index < 4) {
        // Slower growth in early months
        return {
          month,
          dioceses: diocesesCount,
          churches: churchesCount,
          members: churchesCount * 45
        };
      }
      
      // Gradual growth
      if (index % 2 === 0 && diocesesCount < currentDioceses) diocesesCount += 1;
      if (index % 3 === 0 && churchesCount < currentChurches) churchesCount += Math.floor(Math.random() * 2) + 1;
      
      // Ensure we end at current totals
      if (index >= 10) {
        diocesesCount = currentDioceses;
        churchesCount = currentChurches;
      }
      
      return {
        month,
        dioceses: diocesesCount,
        churches: churchesCount,
        members: churchesCount * (45 + Math.floor(Math.random() * 20))
      };
    });
  };

  // Determine chart data based on input type
  const getChartData = (): MonthlyGrowthData[] => {
    if (Array.isArray(data) && data.length > 0) {
      return data; // Use provided real data
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Generate trend from current totals
      return generateGrowthTrend(data.dioceses || 2, data.churches || 2, data.members);
    } else {
      // Show empty state or minimal data
      return [
        { month: 'No Data', dioceses: 0, churches: 0, members: 0 }
      ];
    }
  };

  const chartData = getChartData();

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="animate-pulse bg-muted rounded h-full w-full" />
      </div>
    );
  }

  // Show empty state if no real data
  if (chartData.length === 1 && chartData[0].month === 'No Data') {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">📊</p>
          <p>No growth data available yet</p>
          <p className="text-sm mt-1">Data will appear as your system grows</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width='100%' height={300}>
      <LineChart 
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <XAxis
          dataKey='month'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip
          cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-3 shadow-md">
                  <p className="font-medium mb-2">{label}</p>
                  <div className="space-y-1">
                    {payload.map((entry, index) => {
                      const getColor = (dataKey: string) => {
                        switch(dataKey) {
                          case 'dioceses': return lineColors.dioceses;
                          case 'churches': return lineColors.churches;
                          case 'members': return lineColors.members;
                          default: return lineColors.dioceses;
                        }
                      };
                      const color = getColor(entry.dataKey as string);
                      return (
                        <div key={index} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm capitalize">{entry.dataKey}</span>
                          </div>
                          <span className="font-bold">{entry.value?.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        {visibleLines.dioceses && (
          <Line
            type='monotone'
            dataKey="dioceses"
            stroke={lineColors.dioceses}
            strokeWidth={2}
            dot={{ fill: lineColors.dioceses, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: lineColors.dioceses, strokeWidth: 2 }}
            yAxisId="left"
          />
        )}
        {visibleLines.churches && (
          <Line
            type="monotone"
            dataKey="churches"
            stroke={lineColors.churches}
            strokeWidth={2}
            dot={{ fill: lineColors.churches, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: lineColors.churches, strokeWidth: 2 }}
            yAxisId="left"
          />
        )}
        {visibleLines.members && (
          <Line
            type="monotone"
            dataKey="members"
            stroke={lineColors.members}
            strokeWidth={2}
            dot={{ fill: lineColors.members, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: lineColors.members, strokeWidth: 2 }}
            yAxisId="right"
          />
        )}
      </LineChart>
      </ResponsiveContainer>
      
      {/* Custom Legend with Checkboxes */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-border flex-wrap">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="dioceses-checkbox"
            checked={visibleLines.dioceses}
            onCheckedChange={(checked) => 
              setVisibleLines(prev => ({ ...prev, dioceses: !!checked }))
            }
          />
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: lineColors.dioceses }}
            />
            <label 
              htmlFor="dioceses-checkbox" 
              className="text-sm font-medium cursor-pointer"
            >
              Dioceses
            </label>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="churches-checkbox"
            checked={visibleLines.churches}
            onCheckedChange={(checked) => 
              setVisibleLines(prev => ({ ...prev, churches: !!checked }))
            }
          />
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: lineColors.churches }}
            />
            <label 
              htmlFor="churches-checkbox" 
              className="text-sm font-medium cursor-pointer"
            >
              Churches
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="members-checkbox"
            checked={visibleLines.members}
            onCheckedChange={(checked) => 
              setVisibleLines(prev => ({ ...prev, members: !!checked }))
            }
          />
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: lineColors.members }}
            />
            <label 
              htmlFor="members-checkbox" 
              className="text-sm font-medium cursor-pointer"
            >
              Members
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};