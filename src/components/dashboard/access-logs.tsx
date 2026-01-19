import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { AccessLog, Gate, Vehicle } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";

interface AccessLogsProps {
  logs: AccessLog[];
  gates?: Gate[];
  vehicles?: Vehicle[];
}

export function AccessLogs({ logs, gates = [], vehicles = [] }: AccessLogsProps) {

  const gateMap = React.useMemo(() => 
    gates.reduce((acc, gate) => {
      acc[gate.id] = gate.location;
      return acc;
    }, {} as Record<string, string>), 
  [gates]);

  const vehicleMap = React.useMemo(() => 
    vehicles.reduce((acc, vehicle) => {
      acc[vehicle.id] = vehicle.licensePlate;
      return acc;
    }, {} as Record<string, string>),
  [vehicles]);

  const formattedLogs = React.useMemo(() => {
    return logs
      .filter(log => !!log.timestamp)
      .map(log => ({
        ...log,
        timestamp: log.timestamp.toDate(),
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [logs]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vehicle</TableHead>
          <TableHead>Gate</TableHead>
          <TableHead className="hidden md:table-cell">Timestamp</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formattedLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-medium">{vehicleMap[log.vehicleId] || log.vehicleId}</TableCell>
            <TableCell>{gateMap[log.gateId] || log.gateId}</TableCell>
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
