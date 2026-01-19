
"use client";

import * as React from "react";
import {
  collection,
  doc,
} from "firebase/firestore";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
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
import type { Gate } from "@/lib/types";
import { PlusCircle, Loader2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export function GateList() {
  const firestore = useFirestore();
  const gatesCollection = useMemoFirebase(() => collection(firestore, "gates"), [firestore]);
  const { data: gates, isLoading } = useCollection<Gate>(gatesCollection);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedGate, setSelectedGate] = React.useState<Gate | null>(null);

  const { toast } = useToast();

  const handleToggleStatus = (gate: Gate) => {
    const gateRef = doc(firestore, "gates", gate.id);
    const newStatus = gate.status === "open" ? "closed" : "open";
    updateDocumentNonBlocking(gateRef, { status: newStatus });
    toast({
      title: "Gate status updated",
      description: `Gate ${gate.location} is now ${newStatus}.`,
    });
  };

  const handleAddGate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const location = formData.get("location") as string;
    
    if (location) {
      const newGateRef = doc(gatesCollection);
      const newGate: Gate = { id: newGateRef.id, location, status: "closed" };
      setDocumentNonBlocking(newGateRef, newGate, {});
      toast({
        title: "Gate Added",
        description: `Gate with location "${location}" has been added.`,
      });
      setIsAddDialogOpen(false);
      form.reset();
    }
  };

  const handleEditGate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedGate) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const location = formData.get("location") as string;
    
    if (location && location !== selectedGate.location) {
      const gateRef = doc(firestore, "gates", selectedGate.id);
      updateDocumentNonBlocking(gateRef, { location });
      toast({
        title: "Gate Updated",
        description: `Gate location has been updated to "${location}".`,
      });
    }
    setIsEditDialogOpen(false);
    setSelectedGate(null);
  };

  const openEditDialog = (gate: Gate) => {
    setSelectedGate(gate);
    setIsEditDialogOpen(true);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline">Gate Management</CardTitle>
              <CardDescription>
                View, add, and manage port access gates.
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Gate
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleAddGate}>
                  <DialogHeader>
                    <DialogTitle>Add New Gate</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new gate. The ID will be auto-generated.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">
                        Location
                      </Label>
                      <Input id="location" name="location" placeholder="e.g., North Cargo Dock 2" className="col-span-3" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Gate</Button>
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
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gates?.sort((a, b) => a.location.localeCompare(b.location)).map((gate) => (
                <TableRow key={gate.id}>
                  <TableCell className="font-medium">{gate.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`status-switch-${gate.id}`}
                        checked={gate.status === "open"}
                        onCheckedChange={() => handleToggleStatus(gate)}
                        aria-label={`Toggle status for gate ${gate.location}`}
                      />
                       <Label htmlFor={`status-switch-${gate.id}`} className="capitalize">{gate.status}</Label>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(gate)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Gate</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditGate}>
            <DialogHeader>
              <DialogTitle>Edit Gate</DialogTitle>
              <DialogDescription>
                Update the location for this gate.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  Location
                </Label>
                <Input 
                  id="edit-location" 
                  name="location" 
                  defaultValue={selectedGate?.location} 
                  className="col-span-3" 
                  required 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
