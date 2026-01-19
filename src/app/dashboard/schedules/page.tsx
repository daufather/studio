import { ScheduleList } from "@/components/dashboard/schedule-list";
import { schedules, vehicles, gates } from "@/lib/placeholder-data";

export default function SchedulesPage() {
  return (
    <div className="container mx-auto py-10">
      <ScheduleList initialSchedules={schedules} vehicles={vehicles} gates={gates} />
    </div>
  );
}
