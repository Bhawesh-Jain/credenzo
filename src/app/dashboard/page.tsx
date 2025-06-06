'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import {
  ActivityIcon,
  DollarSignIcon,
  UsersIcon,
  ClockIcon,
  FileTextIcon,
  LineChartIcon
} from "lucide-react";
import { ApprovalRateChart, LoanChart } from "@/components/loan-chart";
import { RecentApprovals } from "@/components/recent-approvals";
import { useUser } from "@/contexts/user-context";
import { useEffect } from "react";

export default function Dashboard() {
  const metrics = [
    { id: 1, title: "Total Loans", value: "₹2.4M", icon: DollarSignIcon, trend: "+12.5%", status: "positive" },
    { id: 2, title: "Pending Approvals", value: "24", icon: FileTextIcon, trend: "3 new", status: "neutral" },
    { id: 3, title: "Active Customers", value: "1,234", icon: UsersIcon, trend: "+8.2%", status: "positive" },
    { id: 4, title: "Avg Processing Time", value: "2.4 Days", icon: ClockIcon, trend: "-0.8d", status: "negative" },
  ];

  const {user} = useUser()

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, {user.user_name}</p>
        </div>
        <Button>Generate Report</Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs mt-2">
                <Badge
                  variant={metric.status === 'positive' ? 'success' :
                    metric.status === 'negative' ? 'destructive' : 'outline'}
                  className="mr-2"
                >
                  {metric.trend}
                </Badge>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Loan Trends</CardTitle>
              <Button variant="outline" size="sm">Last 6 Months</Button>
            </div>
          </CardHeader>
          <CardContent>
            <LoanChart />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Loan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovalRateChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Approvals</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecentApprovals />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" className="justify-start">
              <FileTextIcon className="mr-2 h-4 w-4" />
              New Proposal
            </Button>
            <Button variant="outline" className="justify-start">
              <UsersIcon className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
            <Button variant="outline" className="justify-start">
              <LineChartIcon className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="justify-start">
              <ActivityIcon className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}