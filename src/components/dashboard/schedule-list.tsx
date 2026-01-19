"use client";

import * as React from "react";
import {
  collection,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
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
import { PlusCircle, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function ScheduleList() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const schedulesCollection = useMemoFirebase(
    () => (user ? collection(firestore, "users", user.uid, "schedules") : null),
    [firestore, user]
  );
  const { data: schedules, isLoading: isLoadingSchedules } = useCollection<Schedule>(schedulesCollection);

  const vehiclesCollection = useMemoFirebase(
    () => (user ? collection(firestore, "users", user.uid, "vehicles") : null),
    [firestore, user]
  );
  const { data: vehicles, isLoading: isLoadingVehicles } = useCollection<Vehicle>(vehiclesCollection);

  const gatesCollection = useMemoFirebase(() => collection(firestore, "gates"), [firestore]);
  const { data: gates, isLoading: isLoadingGates } = useCollection<Gate>(gatesCollection);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newScheduleDate, setNewScheduleDate] = React.useState<Date | undefined>(new Date());

  const handleAddSchedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!schedulesCollection) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const vehicleId = formData.get("vehicleId") as string;
    const gateId = formData.get("gateId") as string;
    const purpose = formData.get("purpose") as string;
    const scheduledTime = newScheduleDate;

    if (vehicleId && gateId && purpose && scheduledTime) {
       const newScheduleRef = doc(schedulesCollection);
       const newSchedule: Omit<Schedule, "id"> & { id?: string } = {
        vehicleId,
        gateId,
        purpose,
        scheduledTime: Timestamp.fromDate(scheduledTime),
      };
      
      setDocumentNonBlocking(newScheduleRef, { ...newSchedule, id: newScheduleRef.id }, {});
      toast({
        title: "Schedule Created",
        description: `Schedule for vehicle ${vehicles?.find(v => v.id === vehicleId)?.licensePlate} has been created.`,
      });
      setIsDialogOpen(false);
      form.reset();
      setNewScheduleDate(new Date());
    }
  };

  const isLoading = isLoadingSchedules || isLoadingVehicles || isLoadingGates;

  // Convert Firestore Timestamps to Dates for displaying
  const formattedSchedules = React.useMemo(() => {
    return schedules
      ?.map(s => ({
        ...s,
        scheduledTime: s.scheduledTime.toDate(),
      }))
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }, [schedules]);

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1" disabled={!user}>
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
                    <Select name="vehicleId" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles?.map(v => <SelectItem key={v.id} value={v.id}>{v.licensePlate} ({v.type})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gateId" className="text-right">Gate</Label>
                    <Select name="gateId" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a gate" />
                      </SelectTrigger>
                      <SelectContent>
                        {gates?.map(g => <SelectItem key={g.id} value={g.id}>{g.id} - {g.location}</SelectItem>)}
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
                    <Input id="purpose" name="purpose" className="col-span-3" required/>
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
        {isLoading && (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        {!isLoading && (
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
            {formattedSchedules?.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">{vehicles?.find(v => v.id === schedule.vehicleId)?.licensePlate}</TableCell>
                <TableCell>{schedule.gateId}</TableCell>
                <TableCell>{schedule.scheduledTime.toLocaleString()}</TableCell>
                <TableCell>{schedule.purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
