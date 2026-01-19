'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building,
  Truck,
  Calendar,
  Activity,
  Loader2,
} from "lucide-react";
import { AccessLogSummary } from "@/components/dashboard/access-log-summary";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Gate, Vehicle, Schedule, AccessLog } from "@/lib/types";
import { AccessTrendsChart } from '@/components/dashboard/access-trends-chart';

export default function DashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const gatesCollection = useMemoFirebase(() => collection(firestore, 'gates'), [firestore]);
  const { data: gates, isLoading: isLoadingGates } = useCollection<Gate>(gatesCollection);

  const vehiclesCollection = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'vehicles') : null), [firestore, user]);
  const { data: vehicles, isLoading: isLoadingVehicles } = useCollection<Vehicle>(vehiclesCollection);

  const schedulesCollection = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'schedules') : null), [firestore, user]);
  const { data: schedules, isLoading: isLoadingSchedules } = useCollection<Schedule>(schedulesCollection);

  const logsQuery = useMemoFirebase(() => query(collection(firestore, 'access_logs'), orderBy('timestamp', 'desc')), [firestore]);
  const { data: accessLogs, isLoading: isLoadingLogs } = useCollection<AccessLog>(logsQuery);
  
  const isLoading = isLoadingGates || isLoadingVehicles || isLoadingSchedules || isLoadingLogs;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-headline font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gates</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gates?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {gates?.filter((g) => g.status === 'open').length || 0} gates currently open
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              My Registered Vehicles
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Vehicles I manage
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Upcoming Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{schedules?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total schedules created
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Access Events (All Time)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessLogs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {accessLogs?.filter(l => l.access === 'denied').length || 0} access denials
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <AccessTrendsChart logs={accessLogs || []} />
        <AccessLogSummary logs={accessLogs || []} gates={gates || []} vehicles={vehicles || []} />
      </div>
    </div>
  );
}
