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
import { getAccessLogSummary } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
import type { AccessLog } from "@/lib/types";

export function AccessLogSummary({ logs }: { logs: AccessLog[] }) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [summary, setSummary] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

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

    const filteredLogs = logs.filter(log => {
      const logDate = log.timestamp.toDate();
      // Ensure date.from and date.to are valid dates before comparing
      return date.from && date.to && logDate >= date.from && logDate <= date.to;
    });

    const summaryText = await getAccessLogSummary({
      startTime: date.from.toISOString(),
      endTime: date.to.toISOString(),
      logs: JSON.stringify(filteredLogs),
    });
    setSummary(summaryText);
    setIsLoading(false);
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
