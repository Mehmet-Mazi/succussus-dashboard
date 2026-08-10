import { cookies } from "next/headers";

import { getClientCookie } from "@/lib/cookie.client";

import type { TimesheetSubmission } from "./_components/data";
import { TimesheetKpiCards } from "./_components/timesheet-kpi-cards";
import { TimesheetSubmissions } from "./_components/timesheet-submissions";

async function getTimesheets(): Promise<TimesheetSubmission[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  console.log("cookieStore:", accessToken);
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/timesheets/", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch timesheets");
  }
  const res = await response.json();
  return res;
}

export default async function TimesheetsPage() {
  const timesheets = await getTimesheets();
  console.log("timesheets", timesheets);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <TimesheetKpiCards />
      <TimesheetSubmissions timesheets={timesheets} />
    </div>
  );
}
