import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccessLogs } from "@/components/dashboard/access-logs";
import { accessLogs } from "@/lib/placeholder-data";

export default function LogsPage() {
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
          <AccessLogs logs={accessLogs} />
        </CardContent>
      </Card>
    </div>
  );
}
