"use client";

import * as React from "react";
import {
  collection,
  doc,
} from "firebase/firestore";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { setDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { PlusCircle, MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function GateList() {
  const firestore = useFirestore();
  const gatesCollection = useMemoFirebase(() => collection(firestore, "gates"), [firestore]);
  const { data: gates, isLoading } = useCollection<Gate>(gatesCollection);
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleToggleStatus = (id: string, currentStatus: "open" | "closed") => {
    const gateRef = doc(firestore, "gates", id);
    const newStatus = currentStatus === "open" ? "closed" : "open";
    updateDocumentNonBlocking(gateRef, { status: newStatus });
    toast({
      title: "Gate status updated",
      description: `Gate ${id} is now ${newStatus}.`,
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
      setIsDialogOpen(false);
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">Gate Management</CardTitle>
            <CardDescription>
              View, add, and manage port access gates.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <TableHead>ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gates?.sort((a, b) => a.id.localeCompare(b.id)).map((gate) => (
              <TableRow key={gate.id}>
                <TableCell className="font-medium">{gate.id}</TableCell>
                <TableCell>{gate.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={gate.status === "open" ? "default" : "secondary"}
                    className={cn(
                      "transition-colors",
                      gate.status === "open"
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    )}
                  >
                    {gate.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleToggleStatus(gate.id, gate.status)}>
                        Toggle Status
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
