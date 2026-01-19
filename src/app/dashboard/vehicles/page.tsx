import { VehicleList } from "@/components/dashboard/vehicle-list";
import { vehicles } from "@/lib/placeholder-data";

export default function VehiclesPage() {
  return (
    <div className="container mx-auto py-10">
      <VehicleList initialVehicles={vehicles} />
    </div>
  );
}
