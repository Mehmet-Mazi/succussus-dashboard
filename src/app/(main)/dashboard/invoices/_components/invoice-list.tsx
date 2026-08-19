"use client";

import * as React from "react";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Ellipsis,
  Eye,
  FilterIcon,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DateRangePicker } from "@/components/date-range-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WeekPicker, { DateRange } from "./week-picker";
import { endOfISOWeek, startOfISOWeek } from "date-fns";
import { InvoiceRecord } from "./invoice-data";
import Link from "next/link";

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const successStatusClasses =
  "border-emerald-200 bg-emerald-50 text-emerald-700 " +
  "dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300";
const statusBadgeClasses: Record<InvoiceStatus, string> = {
  FINALISED: successStatusClasses,
  invoice_sent: successStatusClasses,
  unfulfilled:
    "border-red-200 bg-red-50 text-red-700 " +
    "dark:border-red-800 dark:bg-red-950/50 dark:text-red-300",
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 " +
    "dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
};

const invoiceCategories = ["all", "needs-action", "unpaid"] as const;

type InvoiceCategory = (typeof invoiceCategories)[number];
type DateSortDirection = "asc" | "desc";

type Mode = "all" | "range" | "week";

function formatStatus(status: InvoiceStatus) {
  return status
    .split("_")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function isInvoiceCategory(value: string): value is InvoiceCategory {
  return invoiceCategories.includes(value as InvoiceCategory);
}

function formatInvoiceDate(value: string) {
  const date = new Date(value);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Europe/London",
  })
    .format(date)
    .replace(/\s/g, "")
    .toLowerCase();
  const calendarDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date);

  return `${calendarDate}`;
}

export function InvoiceList({ invoiceData }: { invoiceData: InvoiceRecord[] }) {
  const [category, setCategory] = React.useState<InvoiceCategory>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("all");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfISOWeek(new Date()),
    to: endOfISOWeek(new Date()),
  });

  const [dateSortDirection, setDateSortDirection] =
    React.useState<DateSortDirection>("desc");
  const [selectedInvoiceIds, setSelectedInvoiceIds] = React.useState<
    Set<string>
  >(() => new Set());
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);

  const filteredInvoices = React.useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return invoiceData
      .filter((invoice) => {
        // 1. Status filter
        const matchesCategory =
          category === "all" ||
          (category === "unpaid" && !invoice.status.includes("paid")) ||
          (category === "needs-action" &&
            (invoice.status === "pending" || invoice.status === "unfulfilled"));

        if (!matchesCategory) return false;

        // 2. Search filter
        const matchesSearch =
          normalizedQuery === "" ||
          Object.values(invoice).some((value) =>
            String(value).toLowerCase().includes(normalizedQuery),
          );

        if (!matchesSearch) return false;

        // 3. Date filter
        if (mode !== "all" && date?.from) {
          const invoiceDate = new Date(invoice.date);

          // Start of selected range
          const from = new Date(date.from);
          from.setHours(0, 0, 0, 0);

          // End of selected range
          const to = date.to ? new Date(date.to) : new Date(date.from);
          to.setHours(23, 59, 59, 999);

          if (invoiceDate < from || invoiceDate > to) {
            return false;
          }
        }

        return true;
      })
      .sort((firstInvoice, secondInvoice) => {
        const dateDifference =
          Date.parse(firstInvoice.date) - Date.parse(secondInvoice.date);

        return dateSortDirection === "asc" ? dateDifference : -dateDifference;
      });
  }, [category, mode, searchQuery, date, dateSortDirection]);

  const pageCount = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const currentPageIndex = Math.min(pageIndex, pageCount - 1);
  const pageStart = currentPageIndex * pageSize;
  const visibleInvoices = filteredInvoices.slice(
    pageStart,
    pageStart + pageSize,
  );
  const areAllVisibleInvoicesSelected =
    visibleInvoices.length > 0 &&
    visibleInvoices.every((invoice) => selectedInvoiceIds.has(invoice.id));
  const areSomeVisibleInvoicesSelected = visibleInvoices.some((invoice) =>
    selectedInvoiceIds.has(invoice.id),
  );

  function updatePageSize(value: string) {
    const nextPageSize = Number(value);

    if (
      Number.isInteger(nextPageSize) &&
      nextPageSize >= 1 &&
      nextPageSize <= 100
    ) {
      setPageSize(nextPageSize);
      setPageIndex(0);
    }
  }

  function toggleVisibleInvoices(checked: boolean) {
    setSelectedInvoiceIds((currentIds) => {
      const nextIds = new Set(currentIds);

      for (const invoice of visibleInvoices) {
        if (checked) {
          nextIds.add(invoice.id);
        } else {
          nextIds.delete(invoice.id);
        }
      }

      return nextIds;
    });
  }

  function toggleInvoice(invoiceId: string, checked: boolean) {
    setSelectedInvoiceIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (checked) {
        nextIds.add(invoiceId);
      } else {
        nextIds.delete(invoiceId);
      }

      return nextIds;
    });
  }

  function toggleDateSort() {
    const nextDirection: DateSortDirection =
      dateSortDirection === "asc" ? "desc" : "asc";

    setDateSortDirection(nextDirection);
    setPageIndex(0);
    toast.info(
      nextDirection === "asc"
        ? "Sorted by date: oldest first."
        : "Sorted by date: newest first.",
    );
  }

  function handleDownload() {
    // Selection works
    // TODO: enable bulk downloads
    if (selectedInvoiceIds.size === 0) {
      toast.info("Select one or more invoices to download.");
      return;
    }

    console.log(selectedInvoiceIds);

    toast.info(
      `Bulk download for ${selectedInvoiceIds.size} invoice(s) will be available soon.`,
    );
  }
  console.log("date is", date);
  // const [selectedDates, setSelectedDates] = useState()
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">Invoices</CardTitle>
          <CardDescription>Manage generated invoices.</CardDescription>

          <div className="col-span-full mt-3 flex justify-between">
            <Tabs
              className=""
              value={category}
              onValueChange={(value) => {
                if (isInvoiceCategory(value)) {
                  setCategory(value);
                  setPageIndex(0);
                }
              }}
            >
              <TabsList>
                <TabsTrigger value="all" className="px-4">
                  All
                </TabsTrigger>
                <TabsTrigger value="needs-action" className="px-4">
                  Needs action
                </TabsTrigger>
                <TabsTrigger value="unpaid" className="px-4">
                  Unpaid
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-3">
              {mode === "all" ? (
                <></>
              ) : mode === "range" ? (
                <DateRangePicker value={date} onChange={setDate} />
              ) : (
                <WeekPicker value={date} onChange={setDate} />
              )}
              <Select
                defaultValue="all"
                value={mode}
                onValueChange={(value) => setMode(value as Mode)}
              >
                <SelectTrigger>
                  <FilterIcon />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="end">
                  <SelectGroup>
                    <SelectItem value={"all"}>All</SelectItem>
                    <SelectItem value={"range"}>Month</SelectItem>
                    <SelectItem value={"week"}>Week</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Search Invoice"
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </div>
          </div>

          <CardAction>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Download selected invoices"
                title="Download selected invoices"
                onClick={handleDownload}
              >
                <Download />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={
                  dateSortDirection === "asc"
                    ? "Sort invoices by newest date first"
                    : "Sort invoices by oldest date first"
                }
                title={
                  dateSortDirection === "asc"
                    ? "Sort by date: newest first"
                    : "Sort by date: oldest first"
                }
                onClick={toggleDateSort}
              >
                {dateSortDirection === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
            </div>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 px-0">
          <Table
            className={
              "table-fixed **:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 " +
              "**:data-[slot='table-cell']:py-4"
            }
          >
            <TableHeader
              className={
                "border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium " +
                "**:data-[slot='table-head']:text-foreground"
              }
            >
              <TableRow>
                <TableHead className="w-10 text-center">
                  <Checkbox
                    className="mx-auto"
                    aria-label="Select all invoices on this page"
                    checked={
                      areAllVisibleInvoicesSelected ||
                      (areSomeVisibleInvoicesSelected && "indeterminate")
                    }
                    onCheckedChange={(checked) =>
                      toggleVisibleInvoices(Boolean(checked))
                    }
                  />
                </TableHead>
                <TableHead className="">Invoice</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleInvoices.length > 0 ? (
                visibleInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    data-state={
                      selectedInvoiceIds.has(invoice.id)
                        ? "selected"
                        : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        className="mx-auto"
                        aria-label={`Select invoice ${invoice.id}`}
                        checked={selectedInvoiceIds.has(invoice.id)}
                        onCheckedChange={(checked) =>
                          toggleInvoice(invoice.id, Boolean(checked))
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {invoice.invoice_prefix}
                      {invoice.id}
                    </TableCell>
                    <TableCell>{invoice.invoice_from_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge
                          key={invoice.status}
                          variant="outline"
                          className={statusBadgeClasses[invoice.status]}
                        >
                          <span
                            aria-hidden="true"
                            className="size-2 rounded-full bg-current"
                          />
                          {formatStatus(invoice.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {currencyFormatter.format(invoice.total_payment)}
                    </TableCell>
                    <TableCell>
                      {formatInvoiceDate(invoice.invoice_issue_date)}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Open actions for invoice ${invoice.id}`}
                          >
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={invoice.file}>
                              View invoice
                              <Eye />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            Edit invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem className="bg-green-50">
                            Send Invoice <Send />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 px-4 pb-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              Viewing {visibleInvoices.length} out of {filteredInvoices.length}{" "}
              invoices
            </p>

            <div className="flex items-center gap-2">
              <label
                className="text-muted-foreground text-sm"
                htmlFor="invoices-page-size"
              >
                Rows per page
              </label>

              <Input
                id="invoices-page-size"
                className="h-8 w-16 text-center"
                type="number"
                min="1"
                max="100"
                value={pageSize}
                onChange={(event) => updatePageSize(event.target.value)}
              />

              <Button
                variant="outline"
                size="sm"
                disabled={currentPageIndex === 0}
                onClick={() => setPageIndex((currentIndex) => currentIndex - 1)}
              >
                <ChevronLeft />
                Previous
              </Button>

              <span className="flex size-8 items-center justify-center rounded-md bg-muted text-sm">
                {currentPageIndex + 1}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPageIndex >= pageCount - 1}
                onClick={() => setPageIndex((currentIndex) => currentIndex + 1)}
              >
                Next
                <ChevronRight />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
