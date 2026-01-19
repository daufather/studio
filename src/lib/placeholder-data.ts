import type { Gate, Vehicle, Schedule, AccessLog } from '@/lib/types';

export const gates: Gate[] = [
  { id: 'G-001', location: 'North Entrance', status: 'closed' },
  { id: 'G-002', location: 'East Cargo Bay', status: 'open' },
  { id: 'G-003', location: 'West Personnel Gate', status: 'closed' },
  { id: 'G-004', location: 'South Maintenance Access', status: 'closed' },
];

export const vehicles: Vehicle[] = [
  { id: 'V-001', licensePlate: 'TRK-789', type: 'Container Truck', owner: 'Global Logistics', ownerEmail: 'ops@globallogistics.com' },
  { id: 'V-002', licensePlate: 'VAN-456', type: 'Service Van', owner: 'Port Maintenance', ownerEmail: 'maintenance@portauthority.com' },
  { id: 'V-003', licensePlate: 'CAR-123', type: 'Executive Car', owner: 'CEO Office', ownerEmail: 'ceo@portauthority.com' },
  { id: 'V-004', licensePlate: 'CGO-101', type: 'Cargo Hauler', owner: 'SeaWide Shipping', ownerEmail: 'contact@seawide.com' },
];

const now = new Date();
export const schedules: Schedule[] = [
  { id: 'S-001', vehicleId: 'V-001', gateId: 'G-001', scheduledTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), purpose: 'Container Drop-off' },
  { id: 'S-002', vehicleId: 'V-002', gateId: 'G-004', scheduledTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), purpose: 'Routine Maintenance' },
  { id: 'S-003', vehicleId: 'V-003', gateId: 'G-003', scheduledTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), purpose: 'VIP Visit' },
  { id: 'S-004', vehicleId: 'V-001', gateId: 'G-002', scheduledTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), purpose: 'Container Pickup' },
];

export const accessLogs: AccessLog[] = [
  { id: 'L-001', vehicleId: 'V-004', gateId: 'G-001', timestamp: new Date(now.getTime() - 15 * 60 * 1000), access: 'denied', reason: 'No active schedule' },
  { id: 'L-002', vehicleId: 'V-001', gateId: 'G-002', timestamp: new Date(now.getTime() - 30 * 60 * 1000), access: 'granted' },
  { id: 'L-003', vehicleId: 'V-002', gateId: 'G-004', timestamp: new Date(now.getTime() - 45 * 60 * 1000), access: 'granted' },
  { id: 'L-004', vehicleId: 'V-003', gateId: 'G-003', timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), access: 'granted' },
  { id: 'L-005', vehicleId: 'V-004', gateId: 'G-001', timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), access: 'denied', reason: 'No active schedule' },
  { id: 'L-006', vehicleId: 'V-001', gateId: 'G-001', timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), access: 'granted' },
];
