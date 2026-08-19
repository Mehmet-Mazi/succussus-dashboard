import { AccordionContent } from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleAlert, Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TimesheetDialog from "./edit-timesheet";
import { toast } from "sonner";
import AddDeduction from "./deduction-dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import AdjustmentInfoDialog from "./adjustment-info-dialog";

export type Adjustment = {
  id: number;
  category: string;
  amount: string;
  reason: string;
  base_rate: string | null;
  quantity: number | null;
  created_at: string;
};

export type DriverDeductions = {
  [driverName: string]: Adjustment[];
};

export const timesheetFields = {
  id: {
    type: "string",
    label: "id",
  },
  date: {
    label: "Date of Shift",
    type: "date",
  },
  route_number: {
    label: "Route Number",
    type: "number",
  },
  postcode: {
    label: "Postcode",
    type: "text",
  },
  cons: {
    label: "Consignments",
    type: "number",
  },
  stop_rate: {
    label: "Stop Rate",
    type: "number",
  },
  fuel: {
    label: "Fuel Allowance",
    type: "number",
  },
  incentive: {
    label: "Incentive",
    type: "number",
  },
  fuel_total: {
    label: "Total Fuel Pay",
    type: "number",
  },
  incentive_total: {
    label: "Total Incentive Pay",
    type: "number",
  },
  deductions: {
    label: "Deductions",
    type: "number",
  },
  total_stop_pay: {
    label: "Total Stop Pay",
    type: "number",
  },
  total_payment: {
    label: "Total Pay",
    type: "number",
  },
} as const;

export type Timesheet = {
  [K in keyof typeof timesheetFields]: (typeof timesheetFields)[K]["type"] extends "number"
    ? number
    : string;
};

export type IndividualTimesheets = Timesheet[];

export default function TimesheetLayerOne({
  name,
  timesheets,
  adjustments,
}: {
  name: string;
  timesheets: Timesheet[];
  adjustments: Adjustment[];
}) {
  const generateInvoices = (timesheets: string[]) => {
    toast.promise<{ name: string }>(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: "Event" }), 2000),
        ),
      {
        loading: "Loading...",
        success: (data) => `${data.name} has been created`,
        error: "Error",
      },
    );
  };

  return (
    <AccordionContent className="z-40 px-4 flex flex-col gap-5 mt-4">
      <div className="flex justify-between items-center z-30">
        <div className="col-start-1">
          <CardTitle>Daily Timesheets</CardTitle>
        </div>
        <AddDeduction name={name} timesheets={timesheets} />
      </div>
      <div>
        <div className="px-4 py-2 grid grid-cols-[repeat(8,1fr)_auto] items-center bg-gray-500/50 text-white">
          <div>Name</div>
          <div className="">Date</div>
          <div className="">Route Number</div>
          <div className="">Postcode</div>
          <div className="">Fuel Total</div>
          <div className="">Incentive Total</div>
          <div className="">Total Stops Pay</div>
          <div className="">Total Payment</div>
          <div>
            <Button
              className="cursor-pointer"
              variant={"ghost"}
              size={"xs"}
              color="transparent"
            >
              <Pencil size={12} color="transparent" />
            </Button>
          </div>
        </div>
        {timesheets.map((timesheet) => (
          <div
            className="px-4 py-2 odd:bg-secondary-foreground/5  grid grid-cols-[repeat(8,1fr)_auto] items-center"
            key={timesheet.date.toLocaleString()}
          >
            <div className="">{name}</div>
            <div className="">{timesheet.date.toLocaleString()}</div>
            <div className="">{timesheet.route_number}</div>
            <div className="">{timesheet.postcode ?? "---"}</div>
            <div className="">{formatCurrency(timesheet.fuel_total)}</div>
            <div className="">{formatCurrency(timesheet.incentive_total)}</div>
            <div className="">{formatCurrency(timesheet.total_stop_pay)}</div>
            <div className="">{formatCurrency(timesheet.total_payment)}</div>
            <div>
              <TimesheetDialog driver={name} timesheet={timesheet} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(clamp(250px,100%,33.33%-11px),1fr))]">
        {adjustments &&
          adjustments.map((adjustment) => (
            <AdjustmentInfoDialog key={adjustment.id} adjustment={adjustment} />
          ))}
      </div>
    </AccordionContent>
  );
}
