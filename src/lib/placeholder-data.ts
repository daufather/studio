import type { Gate, Vehicle, Schedule, AccessLog } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

// Omit 'id' as Firestore will generate it.
export const gates: Omit<Gate, 'id'>[] = [
  { location: 'North Cargo Dock 1', status: 'open' },
  { location: 'East Gate 3', status: 'closed' },
  { location: 'West Perimeter', status: 'open' },
];

// Omit fields that will be dynamically added based on the logged-in user.
export const vehicles: Omit<Vehicle, 'id' | 'owner' | 'ownerEmail'>[] = [
  { licensePlate: 'TRK-123A', type: 'Truck' },
  { licensePlate: 'CAR-456B', type: 'Car' },
  { licensePlate: 'TRK-789C', type: 'Truck' },
  { licensePlate: 'VAN-101D', type: 'Van' },
];

// This function generates logs with placeholder IDs, which will be replaced
// by actual Firestore IDs during the seeding process.
export const generateAccessLogs = (gateIds: string[], vehicleIds: string[]): Omit<AccessLog, 'id'>[] => {
  if (gateIds.length < 3 || vehicleIds.length < 4) {
    console.warn("Not enough gate or vehicle IDs to generate all mock logs.");
    return [];
  };
  
  const logs: Omit<AccessLog, 'id'>[] = [
    // Jan 19
    { vehicleId: vehicleIds[0], gateId: gateIds[0], timestamp: Timestamp.fromDate(new Date('2024-01-19T08:05:00Z')), access: 'granted' },
    { vehicleId: vehicleIds[1], gateId: gateIds[1], timestamp: Timestamp.fromDate(new Date('2024-01-19T09:15:00Z')), access: 'denied', reason: 'Invalid credentials' },
    { vehicleId: vehicleIds[1], gateId: gateIds[1], timestamp: Timestamp.fromDate(new Date('2024-01-19T09:17:00Z')), access: 'granted' },
    { vehicleId: vehicleIds[2], gateId: gateIds[0], timestamp: Timestamp.fromDate(new Date('2024-01-19T11:30:00Z')), access: 'granted' },
    
    // Jan 20
    { vehicleId: vehicleIds[3], gateId: gateIds[2], timestamp: Timestamp.fromDate(new Date('2024-01-20T10:00:00Z')), access: 'granted' },
    { vehicleId: vehicleIds[0], gateId: gateIds[1], timestamp: Timestamp.fromDate(new Date('2024-01-20T14:22:00Z')), access: 'granted' },
    { vehicleId: vehicleIds[2], gateId: gateIds[2], timestamp: Timestamp.fromDate(new Date('2024-01-20T18:45:00Z')), access: 'denied', reason: 'Gate closed' },

    // Jan 21
    { vehicleId: vehicleIds[1], gateId: gateIds[0], timestamp: Timestamp.fromDate(new Date('2024-01-21T07:55:00Z')), access: 'granted' },
    { vehicleId: vehicleIds[3], gateId: gateIds[0], timestamp: Timestamp.fromDate(new Date('2024-01-21T12:00:00Z')), access: 'granted' },
    { vehicleId: vehicleIds[0], gateId: gateIds[2], timestamp: Timestamp.fromDate(new Date('2024-01-21T16:10:00Z')), access: 'granted' },
  ];
  return logs;
};

// Keep schedules empty, as it's not part of the request.
export const schedules: Schedule[] = [];

// This file is now for seeding, so the exported `accessLogs` array is empty.
export const accessLogs: AccessLog[] = [];
