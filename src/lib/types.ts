import type { Timestamp } from 'firebase/firestore';

export type Gate = {
  id: string;
  location: string;
  status: 'open' | 'closed';
};

export type Vehicle = {
  id: string;
  licensePlate: string;
  type: string;
  owner: string;
  ownerEmail: string;
};

export type Schedule = {
  id: string;
  vehicleId: string;
  gateId: string;
  scheduledTime: Timestamp;
  purpose: string;
};

export type AccessLog = {
  id: string;
  vehicleId: string;
  gateId: string;
  timestamp: Timestamp;
  access: 'granted' | 'denied';
  reason?: string;
};
