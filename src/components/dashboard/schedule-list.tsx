"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Schedule, Vehicle, Gate } from "@/lib/types";
import { PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduleListProps {
  initialSchedules: Schedule[];
  vehicles: Vehicle[];
  gates: Gate[];
}

export function ScheduleList({ initialSchedules, vehicles, gates }: ScheduleListProps) {
  const [schedules, setSchedules] = React.useState<Schedule[]>(initialSchedules);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newScheduleDate, setNewScheduleDate] = React.useState<Date | undefined>();

  const handleAddSchedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const newSchedule: Schedule = {
      id: `S-00${schedules.length + 1}`,
      vehicleId: formData.get("vehicleId") as string,
      gateId: formData.get("gateId") as string,
      purpose: formData.get("purpose") as string,
      scheduledTime: newScheduleDate!,
    };
    
    if (newSchedule.vehicleId && newSchedule.gateId && newSchedule.purpose && newSchedule.scheduledTime) {
      setSchedules(prev => [...prev, newSchedule].sort((a,b) => a.scheduledTime.getTime() - b.scheduledTime.getTime()));
      setIsDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">Schedule Management</CardTitle>
            <CardDescription>
              Create and manage vehicle entry/exit schedules.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (open) {
              setNewScheduleDate(new Date());
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                Create Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddSchedule}>
                <DialogHeader>
                  <DialogTitle>Create New Schedule</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new schedule.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vehicleId" className="text-right">Vehicle</Label>
                    <Select name="vehicleId">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.licensePlate} ({v.type})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gateId" className="text-right">Gate</Label>
                    <Select name="gateId">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a gate" />
                      </SelectTrigger>
                      <SelectContent>
                        {gates.map(g => <SelectItem key={g.id} value={g.id}>{g.id} - {g.location}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date/Time</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "col-span-3 justify-start text-left font-normal",
                              !newScheduleDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newScheduleDate ? format(newScheduleDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newScheduleDate}
                            onSelect={setNewScheduleDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="purpose" className="text-right">Purpose</Label>
                    <Input id="purpose" name="purpose" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Schedule</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Gate</TableHead>
              <TableHead>Scheduled Time</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">{vehicles.find(v => v.id === schedule.vehicleId)?.licensePlate}</TableCell>
                <TableCell>{schedule.gateId}</TableCell>
                <TableCell>{schedule.scheduledTime.toLocaleString()}</TableCell>
                <TableCell>{schedule.purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
