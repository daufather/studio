'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccessLogs } from "@/components/dashboard/access-logs";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { AccessLog } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function LogsPage() {
  const firestore = useFirestore();
  const logsCollection = useMemoFirebase(() => collection(firestore, 'access_logs'), [firestore]);
  const { data: logs, isLoading } = useCollection<AccessLog>(logsCollection);
  
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
            <AccessLogs logs={logs || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
