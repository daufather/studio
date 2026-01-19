'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccessLogs } from "@/components/dashboard/access-logs";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection } from "firebase/firestore";
import type { AccessLog, Gate, Vehicle } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function LogsPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const logsCollection = useMemoFirebase(() => collection(firestore, 'access_logs'), [firestore]);
  const { data: logs, isLoading: isLoadingLogs } = useCollection<AccessLog>(logsCollection);
  
  const gatesCollection = useMemoFirebase(() => collection(firestore, 'gates'), [firestore]);
  const { data: gates, isLoading: isLoadingGates } = useCollection<Gate>(gatesCollection);

  const vehiclesCollection = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'vehicles') : null), [firestore, user]);
  const { data: vehicles, isLoading: isLoadingVehicles } = useCollection<Vehicle>(vehiclesCollection);

  const isLoading = isLoadingLogs || isLoadingGates || isLoadingVehicles;
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Access Logs</CardTitle>
          <CardDescription>
            A complete history of all vehicle access events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <AccessLogs logs={logs || []} gates={gates || []} vehicles={vehicles || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
