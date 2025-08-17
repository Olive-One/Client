import React, { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import type { IncomeExpenseGrowthData } from '@/types/growthMetrics.types';

interface IncomeExpenseGrowthChartProps {
  data: IncomeExpenseGrowthData[];
  isLoading?: boolean;
}

export const IncomeExpenseGrowthChart: React.FC<IncomeExpenseGrowthChartProps> = ({ 
  data = [], 
  isLoading = false 
}) => {
  const [visibleLines, setVisibleLines] = useState({
    income: true,
    expense: true
  });

  // Define distinct colors for each line
  const lineColors = {
    income: '#10b981', // Green for income
    expense: '#ef4444', // Red for expense
  };

  // Transform backend data to chart format
  const transformData = (data: IncomeExpenseGrowthData[]): IncomeExpenseGrowthData[] => {
    return data.map(item => ({
      month: item.month,
      income: item.income || 0,
      expense: item.expense || 0
    }));
  };

  // Determine chart data based on input type
  const getChartData = (): IncomeExpenseGrowthData[] => {
    if (Array.isArray(data) && data.length > 0) {
      return transformData(data);
    } else {
      return [];
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
          <p className="text-lg mb-2">💰</p>
          <p>No financial data available yet</p>
          <p className="text-sm mt-1">Data will appear as income and expenses are recorded</p>
        </div>
      </div>
    );
  }

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div>
      <ResponsiveContainer width='100%' height={400}>
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
          tickFormatter={(value) => formatCurrency(value)}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value)}
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
                          case 'income': return lineColors.income;
                          case 'expense': return lineColors.expense;
                          default: return lineColors.income;
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
                          <span className="font-bold">{formatCurrency(entry.value as number)}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Show net income/loss */}
                  {payload.length === 2 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Net:</span>
                        <span className={`font-bold ${
                          (payload[0].value as number) - (payload[1].value as number) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {formatCurrency((payload[0].value as number) - (payload[1].value as number))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return null;
          }}
        />
        {visibleLines.income && (
          <Line
            type='monotone'
            dataKey="income"
            stroke={lineColors.income}
            strokeWidth={2}
            dot={{ fill: lineColors.income, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: lineColors.income, strokeWidth: 2 }}
            yAxisId="left"
          />
        )}
        {visibleLines.expense && (
          <Line
            type="monotone"
            dataKey="expense"
            stroke={lineColors.expense}
            strokeWidth={2}
            dot={{ fill: lineColors.expense, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: lineColors.expense, strokeWidth: 2 }}
            yAxisId="right"
          />
        )}
      </LineChart>
      </ResponsiveContainer>
      
      {/* Custom Legend with Checkboxes */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-border flex-wrap">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="income-checkbox"
            checked={visibleLines.income}
            onCheckedChange={(checked) => 
              setVisibleLines(prev => ({ ...prev, income: !!checked }))
            }
          />
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: lineColors.income }}
            />
            <label 
              htmlFor="income-checkbox" 
              className="text-sm font-medium cursor-pointer"
            >
              Income
            </label>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="expense-checkbox"
            checked={visibleLines.expense}
            onCheckedChange={(checked) => 
              setVisibleLines(prev => ({ ...prev, expense: !!checked }))
            }
          />
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: lineColors.expense }}
            />
            <label 
              htmlFor="expense-checkbox" 
              className="text-sm font-medium cursor-pointer"
            >
              Expense
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};