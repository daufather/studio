"use client";

import * as React from "react";
import { collection, doc } from "firebase/firestore";
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
import type { Vehicle } from "@/lib/types";
import { PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function VehicleList() {
  const firestore = useFirestore();
  const { user } = useUser();
  const vehiclesCollection = useMemoFirebase(
    () => (user ? collection(firestore, "users", user.uid, "vehicles") : null),
    [firestore, user]
  );
  const { data: vehicles, isLoading } = useCollection<Vehicle>(vehiclesCollection);
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleAddVehicle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vehiclesCollection) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const licensePlate = formData.get("licensePlate") as string;
    const type = formData.get("type") as string;
    const owner = formData.get("owner") as string;
    const ownerEmail = formData.get("ownerEmail") as string;

    if (licensePlate && type && owner && ownerEmail) {
      const newVehicleRef = doc(vehiclesCollection);
      const newVehicle: Vehicle = {
        id: newVehicleRef.id,
        licensePlate,
        type,
        owner,
        ownerEmail
      };
      setDocumentNonBlocking(newVehicleRef, newVehicle, {});
      toast({
        title: "Vehicle Added",
        description: `Vehicle ${licensePlate} has been registered.`,
      });
      setIsDialogOpen(false);
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">Vehicle Management</CardTitle>
            <CardDescription>
              View, add, and manage your registered vehicles.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1" disabled={!user}>
                <PlusCircle className="h-3.5 w-3.5" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddVehicle}>
                <DialogHeader>
                  <DialogTitle>Register New Vehicle</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new vehicle.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="licensePlate" className="text-right">License Plate</Label>
                    <Input id="licensePlate" name="licensePlate" className="col-span-3" required/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Input id="type" name="type" className="col-span-3" required/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="owner" className="text-right">Owner</Label>
                    <Input id="owner" name="owner" className="col-span-3" defaultValue={user?.displayName || ''} required/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ownerEmail" className="text-right">Owner Email</Label>
                    <Input id="ownerEmail" name="ownerEmail" type="email" className="col-span-3" defaultValue={user?.email || ''} required/>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Vehicle</Button>
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
              <TableHead>License Plate</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="hidden md:table-cell">Owner Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles?.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.owner}</TableCell>
                <TableCell className="hidden md:table-cell">{vehicle.ownerEmail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
