'use client';

import * as React from 'react';
import {
  collection,
  doc,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  gates as mockGates,
  vehicles as mockVehicles,
  generateAccessLogs,
} from '@/lib/placeholder-data';
import type { Vehicle } from '@/lib/types';
import { Database } from 'lucide-react';

export function SeedButton() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);

  const handleSeedData = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to seed data.',
      });
      return;
    }

    setIsSeeding(true);
    toast({
      title: 'Seeding Data...',
      description: 'Populating the database with mock data. Please wait.',
    });

    try {
      const batch = writeBatch(firestore);

      // --- Gates ---
      const gatesCollection = collection(firestore, 'gates');
      const existingGatesSnap = await getDocs(gatesCollection);
      let gateIds = existingGatesSnap.docs.map(d => d.id);

      if (existingGatesSnap.empty) {
        const newGateIds: string[] = [];
        mockGates.forEach(gateData => {
          const gateRef = doc(gatesCollection);
          batch.set(gateRef, { ...gateData, id: gateRef.id });
          newGateIds.push(gateRef.id);
        });
        gateIds = newGateIds;
      }

      // --- Vehicles ---
      const vehiclesCollection = collection(firestore, 'users', user.uid, 'vehicles');
      const existingVehiclesSnap = await getDocs(vehiclesCollection);
      let vehicleIds = existingVehiclesSnap.docs.map(d => d.id);
      
      if (existingVehiclesSnap.empty) {
        const newVehicleIds: string[] = [];
        mockVehicles.forEach(vehicleData => {
          const vehicleRef = doc(vehiclesCollection);
          const newVehicle: Vehicle = {
            ...vehicleData,
            id: vehicleRef.id,
            owner: user.displayName || 'Demo User',
            ownerEmail: user.email || 'demo@example.com',
          };
          batch.set(vehicleRef, newVehicle);
          newVehicleIds.push(vehicleRef.id);
        });
        vehicleIds = newVehicleIds;
      }

      // --- Access Logs ---
      const accessLogsCollection = collection(firestore, 'access_logs');
      const logsToCreate = generateAccessLogs(gateIds, vehicleIds);

      logsToCreate.forEach(logData => {
        const logRef = doc(accessLogsCollection);
        batch.set(logRef, { ...logData, id: logRef.id });
      });

      // Commit the batch
      await batch.commit();

      toast({
        title: 'Seeding Complete',
        description: 'Database has been populated successfully.',
      });
    } catch (error: any) {
      console.error('Seeding failed:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: error.message || 'An unexpected error occurred during seeding.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSeedData}
      disabled={isSeeding || !user}
      className="gap-1"
    >
      <Database className="h-3.5 w-3.5" />
      {isSeeding ? 'Seeding...' : 'Seed Database'}
    </Button>
  );
}
