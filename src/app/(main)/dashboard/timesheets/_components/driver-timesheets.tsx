"use client";

import TimesheetLayerOne, {
  Adjustment,
  DriverDeductions,
  IndividualTimesheets,
  Timesheet,
} from "./driver-timesheet-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, FilePlus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export type Submission = {
  name: string;
  week: string;
  total_days: number;
  total_stops: number;
  total_payment: number;
  timesheet: Timesheet[];
  adjustments: Adjustment[];
};

export default function DriverTimesheets({
  week,
  timesheets,
  adjustments,
}: {
  week: string;
  timesheets: IndividualTimesheets[];
  adjustments: DriverDeductions;
}) {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const uuid = params.slug;
  const [open, setOpen] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10); // UNIMPLEMENTED
  const [pageIndex, setPageIndex] = useState(0);
  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();

    return timesheets.filter((detail) => {
      const valueMatches = Object.values(detail).some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      );

      return valueMatches;
    });
  }, [timesheets, searchQuery]);

  console.log(timesheets);

  const driverTimesheetsOverview: Submission[] = filteredSubmissions.map(
    (timesheet) => ({
      driver_id: timesheet.id,
      name: timesheet.name,
      invoice_url: timesheet.invoice_url ?? "",
      week: week,
      total_days: timesheet.timesheet_lines.length,
      total_stops: timesheet.total_stops,
      total_payment: timesheet.total_payment,
      timesheets: timesheet.timesheet_lines,
      status: timesheet.status,
      adjustments: adjustments[timesheet.name],
    }),
  );
  console.log(driverTimesheetsOverview);

  async function generateBulkInvoiceRequest() {
    const body = JSON.stringify({ timesheet_batch_id: uuid });
    console.log(body, uuid);
    const response = fetch("/api/invoices/", {
      method: "POST",
      body: body,
    }).then((resolve) => {
      if (resolve) return "Successfully Generated.";
    });
    toast.promise(response, {
      loading: "This will take a few seconds.",
      success: (data) => {
        router.refresh();
        return data;
      },
      error: "Something went wrong. Please try again later.",
    });
  }

  async function generateInvoiceRequest(driver_id: string) {
    const body = JSON.stringify({
      timesheet_batch_id: uuid,
      driver_id: driver_id,
    });

    const response = fetch("/api/invoices/", {
      method: "POST",
      body: body,
    }).then((resolve) => {
      if (resolve) return "Successfully Generated.";
    });

    toast.promise(response, {
      loading: "This will take a few seconds.",
      success: (data) => {
        router.refresh();
        return data;
      },
      error: "Something went wrong. Please try again later.",
    });
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Driver Timesheets</CardTitle>
        <CardDescription>Inspect individual timesheets </CardDescription>
        <CardAction>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button type="button" onClick={generateBulkInvoiceRequest}>
              Generate All Invoices
            </Button>
            <Input
              className="h-8 w-48 md:w-56"
              placeholder="Search driver name..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPageIndex(0);
              }}
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="border-t **:data-[slot='table-head']:h-14 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground">
          <div className="grid grid-cols-[repeat(6,1fr)_auto] h-14 font-medium text-foreground px-4 items-center">
            <div className="">Name</div>
            <div className="">Shifts</div>
            <div className="">Stops Completed</div>
            <div className="">Total Payment</div>
            <div className="">Status</div>
            <div className="">Action</div>
            <div className="w-5"></div>
          </div>
        </div>
        <Accordion
          className="AccordionRoot grid gap-4"
          type="single"
          collapsible
          value={open}
          onValueChange={setOpen}
        >
          {driverTimesheetsOverview.map((submission) => {
            const value = `item-${submission.name}`;
            return (
              <AccordionItem
                key={submission.name}
                className="relative overflow-hidden border-none"
                value={`item-${submission.name}`}
              >
                <div className="border border-foreground/20 rounded-lg overflow-hidden ">
                  <div
                    className={`no-underline! h-14 rounded-none  ${open === `item-${submission.name}` && "bg-muted-foreground/10"} hover:bg-muted-foreground/5 cursor-pointer grid grid-cols-[repeat(6,1fr)_auto] px-4 place-content-center items-center z-0`}
                    onClick={() => {
                      setOpen(open ? "" : value);
                    }}
                  >
                    <div className=" font-medium">{submission.name}</div>
                    <div className="">{submission.total_days}</div>
                    <div className="">{submission.total_stops}</div>
                    <div className=" font-medium tabular-nums w-full ">
                      <Badge
                        variant="outline"
                        className={
                          Number(submission.total_payment) > 0
                            ? "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300 p-4"
                            : "p-4"
                        }
                      >
                        £ {submission.total_payment}
                      </Badge>
                    </div>
                    <div>
                      {submission.status === "Pending" ? (
                        <Badge
                          variant="outline"
                          className={
                            "border-orange-200 bg-orange-500/10 text-orange-700 dark:border-orange-900/40 dark:bg-orange-500/15 dark:text-orange-300 p-4"
                          }
                        >
                          Invoice Pending
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className={
                            "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300 p-4"
                          }
                        >
                          Invoiced
                        </Badge>
                      )}
                    </div>
                    {submission.status === "Pending" ? (
                      <Button
                        title="Generate the invoices for this week"
                        type="button"
                        variant={"outline"}
                        size={"sm"}
                        className="w-fit"
                        onClick={async (e) => {
                          e.stopPropagation();
                          generateInvoiceRequest(submission.driver_id);
                        }}
                      >
                        <FilePlus /> Generate Invoice
                      </Button>
                    ) : (
                      <Button
                        title="View Invoice"
                        type="button"
                        variant={"outline"}
                        size={"sm"}
                        className="w-fit"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={submission.invoice_url}>
                          <Download />
                          View Invoice
                        </Link>
                      </Button>
                    )}
                    <AccordionTrigger className="w-5"></AccordionTrigger>
                  </div>
                  <AccordionContent className="z-20">
                    <TimesheetLayerOne
                      name={submission.name}
                      timesheets={submission.timesheets}
                      adjustments={submission.adjustments}
                    />
                  </AccordionContent>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
