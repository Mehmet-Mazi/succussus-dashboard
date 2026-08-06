"use client";

import * as React from "react";

import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Ellipsis,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { invoiceTestData, type InvoiceStatus } from "./invoice-data";

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
  paid: successStatusClasses,
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

  return `${time} ${calendarDate}`;
}

export function InvoiceList() {
  const [category, setCategory] = React.useState<InvoiceCategory>("all");
  const [dateSortDirection, setDateSortDirection] = React.useState<DateSortDirection>("asc");
  const [selectedInvoiceIds, setSelectedInvoiceIds] = React.useState<Set<string>>(() => new Set());
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);

  const filteredInvoices = React.useMemo(() => {
    return invoiceTestData
      .filter((invoice) => {
        return (
          category === "all" ||
          (category === "unpaid" && !invoice.statuses.includes("paid")) ||
          (category === "needs-action" &&
            invoice.statuses.some((status) => status === "pending" || status === "unfulfilled"))
        );
      })
      .sort((firstInvoice, secondInvoice) => {
        const dateDifference = Date.parse(firstInvoice.date) - Date.parse(secondInvoice.date);

        return dateSortDirection === "asc" ? dateDifference : -dateDifference;
      });
  }, [category, dateSortDirection]);

  const pageCount = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const currentPageIndex = Math.min(pageIndex, pageCount - 1);
  const pageStart = currentPageIndex * pageSize;
  const visibleInvoices = filteredInvoices.slice(pageStart, pageStart + pageSize);
  const areAllVisibleInvoicesSelected =
    visibleInvoices.length > 0 && visibleInvoices.every((invoice) => selectedInvoiceIds.has(invoice.invoice));
  const areSomeVisibleInvoicesSelected = visibleInvoices.some((invoice) =>
    selectedInvoiceIds.has(invoice.invoice),
  );

  function updatePageSize(value: string) {
    const nextPageSize = Number(value);

    if (Number.isInteger(nextPageSize) && nextPageSize >= 1 && nextPageSize <= 100) {
      setPageSize(nextPageSize);
      setPageIndex(0);
    }
  }

  function toggleVisibleInvoices(checked: boolean) {
    setSelectedInvoiceIds((currentIds) => {
      const nextIds = new Set(currentIds);

      for (const invoice of visibleInvoices) {
        if (checked) {
          nextIds.add(invoice.invoice);
        } else {
          nextIds.delete(invoice.invoice);
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
    const nextDirection: DateSortDirection = dateSortDirection === "asc" ? "desc" : "asc";

    setDateSortDirection(nextDirection);
    setPageIndex(0);
    toast.info(
      nextDirection === "asc" ? "Sorted by date: oldest first." : "Sorted by date: newest first.",
    );
  }

  function handleDownload() {
    if (selectedInvoiceIds.size === 0) {
      toast.info("Select one or more invoices to download.");
      return;
    }

    toast.info(`Bulk download for ${selectedInvoiceIds.size} invoice(s) will be available soon.`);
  }

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">Invoices</CardTitle>
          <CardDescription>Manage generated invoices.</CardDescription>

          <Tabs
            className="col-span-full mt-3"
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
              "**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 " +
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
                    onCheckedChange={(checked) => toggleVisibleInvoices(Boolean(checked))}
                  />
                </TableHead>
                <TableHead className="text-center">Invoice</TableHead>
                <TableHead className="text-center">Driver</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleInvoices.length > 0 ? (
                visibleInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.invoice}
                    data-state={selectedInvoiceIds.has(invoice.invoice) ? "selected" : undefined}
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        className="mx-auto"
                        aria-label={`Select invoice ${invoice.invoice}`}
                        checked={selectedInvoiceIds.has(invoice.invoice)}
                        onCheckedChange={(checked) => toggleInvoice(invoice.invoice, Boolean(checked))}
                      />
                    </TableCell>
                    <TableCell className="text-center font-medium">{invoice.invoice}</TableCell>
                    <TableCell className="text-center">{invoice.driver}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {invoice.statuses.map((status) => (
                          <Badge key={status} variant="outline" className={statusBadgeClasses[status]}>
                            <span aria-hidden="true" className="size-2 rounded-full bg-current" />
                            {formatStatus(status)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {currencyFormatter.format(invoice.total)}
                    </TableCell>
                    <TableCell className="text-center">{formatInvoiceDate(invoice.date)}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Open actions for invoice ${invoice.invoice}`}
                          >
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View invoice</DropdownMenuItem>
                          <DropdownMenuItem>Edit invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 px-4 pb-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              Viewing {visibleInvoices.length} out of {filteredInvoices.length} invoices
            </p>

            <div className="flex items-center gap-2">
              <label className="text-muted-foreground text-sm" htmlFor="invoices-page-size">
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
