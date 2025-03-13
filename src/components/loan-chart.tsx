'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const dummyData = [
  { month: 'Jan', loans: 45, approvals: 38, rejectionRate: 15 },
  { month: 'Feb', loans: 52, approvals: 44, rejectionRate: 12 },
  { month: 'Mar', loans: 68, approvals: 58, rejectionRate: 14 },
  { month: 'Apr', loans: 72, approvals: 63, rejectionRate: 11 },
  { month: 'May', loans: 65, approvals: 57, rejectionRate: 12 },
  { month: 'Jun', loans: 80, approvals: 70, rejectionRate: 10 },
];

export function LoanChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={dummyData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="loans"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))' }}
          />
          <Line
            type="monotone"
            dataKey="approvals"
            stroke="hsl(var(--success))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--success))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Additional bar chart component for approval rates
export function ApprovalRateChart() {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dummyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)'
            }}
          />
          <Bar 
            dataKey="approvals" 
            fill="hsl(var(--success))" 
            radius={[4, 4, 0, 0]}
            name="Approvals"
          />
          <Bar
            dataKey="rejectionRate"
            fill="hsl(var(--destructive))"
            radius={[4, 4, 0, 0]}
            name="Rejection Rate (%)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}