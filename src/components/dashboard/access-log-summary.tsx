"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import type { AccessLog, Gate, Vehicle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function AccessLogSummary({ logs, gates, vehicles }: { logs: AccessLog[], gates: Gate[], vehicles: Vehicle[] }) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [summary, setSummary] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setDate({
      from: new Date(new Date().setDate(new Date().getDate() - 7)),
      to: new Date(),
    });
  }, []);

  const handleGenerateSummary = async () => {
    if (!date?.from || !date?.to) return;
    setIsLoading(true);
    setSummary("");

    try {
      const gateMap = (gates || []).reduce((acc, gate) => {
        acc[gate.id] = gate.location;
        return acc;
      }, {} as Record<string, string>);

      const vehicleMap = (vehicles || []).reduce((acc, vehicle) => {
        acc[vehicle.id] = vehicle.licensePlate;
        return acc;
      }, {} as Record<string, string>);

      const filteredLogs = (logs || [])
        .filter(log => {
          if (!log.timestamp) return false;
          const logDate = log.timestamp.toDate();
          return date.from && date.to && logDate >= date.from && logDate <= date.to;
        })
        .map(log => ({
          gate: gateMap[log.gateId] || log.gateId,
          vehicle: vehicleMap[log.vehicleId] || log.vehicleId,
          timestamp: log.timestamp.toDate().toISOString(),
          access: log.access,
          reason: log.reason,
        }));

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: date.from.toISOString(),
          endTime: date.to.toISOString(),
          logs: JSON.stringify(filteredLogs),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const result = await response.json();
      setSummary(result.summary);

    } catch (error: any) {
      console.error("Error generating summary:", error);
      toast({
        variant: "destructive",
        title: "Summary Generation Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          AI Log Summary
        </CardTitle>
        <CardDescription>
          Generate an AI-powered summary of access logs for a specific period.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        )}
        {summary && (
          <div className="text-sm text-muted-foreground bg-secondary p-3 rounded-md border">
            {summary}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateSummary} disabled={isLoading || !date} className="w-full bg-primary hover:bg-primary/90">
            {isLoading ? "Generating..." : "Generate Summary"}
        </Button>
      </CardFooter>
    </Card>
  );
}
