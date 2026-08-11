import { cookies } from "next/headers";

import type { TimesheetSubmission } from "./_components/data";
import { TimesheetKpiCards } from "./_components/timesheet-kpi-cards";
import { TimesheetSubmissions } from "./_components/timesheet-submissions";
import { IndividualTimesheets } from "./_components/table";

async function getTimesheets(): Promise<TimesheetSubmission[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const response = await fetch(process.env.API_URL + "/timesheets/", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch timesheets");
  }
  const res = await response.json();
  return res;
}

async function getIndividualTimesheets(): Promise<IndividualTimesheets> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const response = await fetch(process.env.API_URL + "/timesheets/09-08-2026", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch timesheets");
  }
  const res = await response.json();
  return res.data;
}

export default async function TimesheetsPage() {
  const timesheets = await getTimesheets();
  const individualTimesheets = await getIndividualTimesheets();
  console.log("timesheets", JSON.stringify(individualTimesheets));

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <TimesheetKpiCards />
      <TimesheetSubmissions timesheets={timesheets} individualTimesheets={individualTimesheets} />
    </div>
  );
}
