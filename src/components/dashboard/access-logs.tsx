import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AccessLog } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AccessLogsProps {
  logs: AccessLog[];
}

export function AccessLogs({ logs }: AccessLogsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vehicle ID</TableHead>
          <TableHead>Gate ID</TableHead>
          <TableHead className="hidden md:table-cell">Timestamp</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-medium">{log.vehicleId}</TableCell>
            <TableCell>{log.gateId}</TableCell>
            <TableCell className="hidden md:table-cell">
              {log.timestamp.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant={log.access === "granted" ? "secondary" : "destructive"}
                className={cn(
                    log.access === "granted" && "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
                    log.access === "denied" && "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
                )}
              >
                {log.access}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
