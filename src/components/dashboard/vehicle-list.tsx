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
import type { Vehicle } from "@/lib/types";
import { PlusCircle } from "lucide-react";

interface VehicleListProps {
  initialVehicles: Vehicle[];
}

export function VehicleList({ initialVehicles }: VehicleListProps) {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(initialVehicles);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddVehicle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const newVehicle: Vehicle = {
      id: `V-00${vehicles.length + 1}`,
      licensePlate: formData.get("licensePlate") as string,
      type: formData.get("type") as string,
      owner: formData.get("owner") as string,
      ownerEmail: formData.get("ownerEmail") as string,
    };
    
    if (newVehicle.licensePlate && newVehicle.type && newVehicle.owner && newVehicle.ownerEmail) {
      setVehicles(prev => [...prev, newVehicle]);
      setIsDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">Vehicle Management</CardTitle>
            <CardDescription>
              View, add, and manage registered vehicles.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
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
                    <Input id="licensePlate" name="licensePlate" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Input id="type" name="type" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="owner" className="text-right">Owner</Label>
                    <Input id="owner" name="owner" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ownerEmail" className="text-right">Owner Email</Label>
                    <Input id="ownerEmail" name="ownerEmail" type="email" className="col-span-3" />
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
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.owner}</TableCell>
                <TableCell className="hidden md:table-cell">{vehicle.ownerEmail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
