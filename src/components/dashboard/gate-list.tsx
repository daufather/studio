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
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GateListProps {
  initialGates: Gate[];
}

export function GateList({ initialGates }: GateListProps) {
  const [gates, setGates] = React.useState<Gate[]>(initialGates);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleToggleStatus = (id: string) => {
    setGates((prevGates) =>
      prevGates.map((gate) =>
        gate.id === id
          ? { ...gate, status: gate.status === "open" ? "closed" : "open" }
          : gate
      )
    );
  };

  const handleAddGate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const id = formData.get("id") as string;
    const location = formData.get("location") as string;
    
    if (id && location) {
      const newGate: Gate = { id, location, status: "closed" };
      setGates(prev => [...prev, newGate]);
      setIsDialogOpen(false);
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
                    Enter the details for the new gate.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">
                      Gate ID
                    </Label>
                    <Input id="id" name="id" defaultValue={`G-00${gates.length + 1}`} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input id="location" name="location" placeholder="e.g., North Cargo Dock 2" className="col-span-3" />
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
            {gates.map((gate) => (
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
                      <DropdownMenuItem onClick={() => handleToggleStatus(gate.id)}>
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
      </CardContent>
    </Card>
  );
}
