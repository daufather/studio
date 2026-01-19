import { GateList } from "@/components/dashboard/gate-list";
import { gates } from "@/lib/placeholder-data";

export default function GatesPage() {
  return (
    <div className="container mx-auto py-10">
      <GateList initialGates={gates} />
    </div>
  );
}
