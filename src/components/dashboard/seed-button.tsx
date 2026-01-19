'use client';

import * as React from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { gates as mockGates, vehicles as mockVehicles, generateAccessLogs } from '@/lib/placeholder-data';
import type { Vehicle, Gate, AccessLog } from '@/lib/types';
import { Database } from 'lucide-react';

export function SeedButton() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);

  const handleSeedDatabase = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to seed the database.',
      });
      return;
    }

    setIsSeeding(true);
    toast({
      title: 'Seeding Database...',
      description: 'This may take a moment. Please wait.',
    });

    try {
      // 1. Seed Gates and get their new IDs
      const gatesCollectionRef = collection(firestore, 'gates');
      const gatePromises = mockGates.map(async (gateData) => {
        const newGateRef = doc(gatesCollectionRef);
        const newGate: Gate = { ...gateData, id: newGateRef.id };
        await setDoc(newGateRef, newGate);
        return newGate;
      });
      const createdGates = await Promise.all(gatePromises);
      const gateIds = createdGates.map(g => g.id);

      // 2. Seed Vehicles for the current user and get their new IDs
      const vehiclesCollectionRef = collection(firestore, 'users', user.uid, 'vehicles');
      const vehiclePromises = mockVehicles.map(async (vehicleData) => {
        const newVehicleRef = doc(vehiclesCollectionRef);
        const newVehicle: Vehicle = {
          ...vehicleData,
          id: newVehicleRef.id,
          owner: user.displayName || 'Demo User',
          ownerEmail: user.email || 'demo@example.com',
        };
        await setDoc(newVehicleRef, newVehicle);
        return newVehicle;
      });
      const createdVehicles = await Promise.all(vehiclePromises);
      const vehicleIds = createdVehicles.map(v => v.id);

      // 3. Generate and seed Access Logs
      const accessLogsToCreate = generateAccessLogs(gateIds, vehicleIds);
      const accessLogsCollectionRef = collection(firestore, 'access_logs');
      const accessLogPromises = accessLogsToCreate.map(async (logData) => {
        const newLogRef = doc(accessLogsCollectionRef);
        // We need to cast logData because it's Omit<AccessLog, 'id'>
        const newLog: AccessLog = { ...(logData as Omit<AccessLog, 'id' | 'timestamp'>), timestamp: logData.timestamp, id: newLogRef.id };
        await setDoc(newLogRef, newLog);
        return newLog;
      });
      await Promise.all(accessLogPromises);

      toast({
        title: 'Database Seeded Successfully!',
        description: `${createdGates.length} gates, ${createdVehicles.length} vehicles, and ${accessLogsToCreate.length} access logs were created.`,
      });
    } catch (error: any) {
      console.error('Error seeding database:', error);
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
    <Button variant="outline" size="sm" onClick={handleSeedDatabase} disabled={isSeeding}>
        <Database className="mr-2 h-4 w-4" />
        {isSeeding ? 'Seeding...' : 'Seed Data'}
    </Button>
  );
}
