import { TimesheetKpiCards } from "./_components/timesheet-kpi-cards";
import { TimesheetSubmissions } from "./_components/timesheet-submissions";

export default function TimesheetsPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <TimesheetKpiCards />
      <TimesheetSubmissions />
    </div>
  );
}