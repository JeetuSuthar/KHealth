import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { LabReport, TrendData } from '../../shared/types';

interface TrendsChartProps {
  reports: LabReport[];
}

export default function TrendsChart({ reports }: TrendsChartProps) {
  const trendData = useMemo(() => {
    if (reports.length === 0) {
      // Generate dummy trend data for demonstration
      const dummyData: TrendData[] = [];
      const parameters = ['Cholesterol', 'Glucose', 'Hemoglobin'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      
      months.forEach((month, index) => {
        parameters.forEach(param => {
          let baseValue = 0;
          let variation = 0;
          
          switch (param) {
            case 'Cholesterol':
              baseValue = 200;
              variation = Math.random() * 40 - 20;
              break;
            case 'Glucose':
              baseValue = 90;
              variation = Math.random() * 20 - 10;
              break;
            case 'Hemoglobin':
              baseValue = 13;
              variation = Math.random() * 2 - 1;
              break;
          }
          
          dummyData.push({
            date: month,
            value: Math.round((baseValue + variation) * 10) / 10,
            parameter: param
          });
        });
      });
      
      return dummyData;
    }
    
    // Process real report data
    const data: TrendData[] = [];
    reports.forEach(report => {
      const date = new Date(report.uploadDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      report.parameters.forEach(param => {
        const numericValue = parseFloat(param.value);
        if (!isNaN(numericValue)) {
          data.push({
            date,
            value: numericValue,
            parameter: param.name
          });
        }
      });
    });
    
    return data;
  }, [reports]);

  const chartData = useMemo(() => {
    const grouped = trendData.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { date: item.date };
      }
      acc[item.date][item.parameter] = item.value;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(grouped);
  }, [trendData]);

  const parameters = useMemo(() => {
    return Array.from(new Set(trendData.map(item => item.parameter)));
  }, [trendData]);

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (parameters.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Trend Data Available</h3>
        <p className="text-gray-600">
          Upload more reports to see health parameter trends over time
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {parameters.slice(0, 3).map((param, index) => {
          const paramData = trendData.filter(item => item.parameter === param);
          const latestValue = paramData[paramData.length - 1]?.value || 0;
          const previousValue = paramData[paramData.length - 2]?.value || latestValue;
          const change = latestValue - previousValue;
          const changePercent = previousValue ? ((change / previousValue) * 100).toFixed(1) : '0';
          
          return (
            <div key={param} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{param}</p>
                  <p className="text-2xl font-bold text-gray-900">{latestValue}</p>
                </div>
                <div className={`flex items-center text-sm ${
                  change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {change !== 0 && (
                    <>
                      <TrendingUp className={`h-4 w-4 mr-1 ${
                        change < 0 ? 'transform rotate-180' : ''
                      }`} />
                      {Math.abs(parseFloat(changePercent))}%
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Health Parameter Trends</h3>
            <p className="text-sm text-gray-600">Track your health metrics over time</p>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Last 6 months
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              {parameters.map((param, index) => (
                <Line
                  key={param}
                  type="monotone"
                  dataKey={param}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}