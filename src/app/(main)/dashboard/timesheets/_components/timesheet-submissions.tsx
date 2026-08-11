"use client";

import * as React from "react";

import { ChevronDown, ChevronLeft, ChevronRight, ListFilter, MapPin, Pencil, Upload, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { type TimesheetSubmission, type Timesheetstatus, timesheetStatus } from "./data";
import Rules from "./rules";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TimesheetLayerOne, { IndividualTimesheets } from "./table";

export function TimesheetSubmissions({ timesheets, individualTimesheets }: { timesheets: TimesheetSubmission[]; individualTimesheets: IndividualTimesheets }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<Timesheetstatus[]>([...timesheetStatus]);
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);

  const filteredSubmissions = React.useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();

    return timesheets.filter((submission) => {
      const matchesSearch = Object.values(submission).some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      );

      return matchesSearch && selectedStatus.includes(submission.status);
    });
  }, [timesheets, searchQuery, selectedStatus]);

  const pageCount = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));
  const currentPageIndex = Math.min(pageIndex, pageCount - 1);
  const pageStart = currentPageIndex * pageSize;
  const visibleSubmissions = filteredSubmissions.slice(pageStart, pageStart + pageSize);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  async function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const [file] = event.target.files ?? [];

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/timesheets/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        message?: string;
        originalFileName?: string;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Upload failed.");
      }

      toast.success("Upload successful", {
        description: `${result.originalFileName ?? file.name} has been uploaded.`,
      });
    } catch (error) {
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }
  function togglestatus(status: Timesheetstatus) {
    setSelectedStatus((currentStatus) =>
      currentStatus.includes(status)
        ? currentStatus.filter((currentstatus) => currentstatus !== status)
        : [...currentStatus, status],
    );
    setPageIndex(0);
  }

  function toggleAllstatuss() {
    setSelectedStatus((currentstatus) => (currentstatus.length === timesheetStatus.length ? [] : [...timesheetStatus]));
    setPageIndex(0);
  }

  function updatePageSize(value: string) {
    const nextPageSize = Number(value);

    if (Number.isInteger(nextPageSize) && nextPageSize >= 1 && nextPageSize <= 100) {
      setPageSize(nextPageSize);
      setPageIndex(0);
    }
  }

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">Timesheet Submissions</CardTitle>
          <CardDescription>Manage the timesheets submitted.</CardDescription>

          <CardAction>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Rules />
              <Button type="button" size="sm" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
                <Upload data-icon="inline-start" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>

              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelection}
              />

              {/* <Button type="button" variant="outline" size="sm">
                <Download data-icon="inline-start" />
                Download template
              </Button> */}

              <Input
                className="h-8 w-48 md:w-56"
                placeholder="Search timesheets..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setPageIndex(0);
                }}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ListFilter data-icon="inline-start" />
                    status
                    <ChevronDown data-icon="inline-end" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuGroup>
                    <DropdownMenuCheckboxItem
                      checked={selectedStatus.length === timesheetStatus.length}
                      onCheckedChange={toggleAllstatuss}
                      onSelect={(event) => event.preventDefault()}
                    >
                      All statuss
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    {timesheetStatus.map((status) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        checked={selectedStatus.includes(status)}
                        onCheckedChange={() => togglestatus(status)}
                        onSelect={(event) => event.preventDefault()}
                      >
                        {status}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 px-0 w-full">
          <div className="w-full p-4">
            <div className="border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground">
              <div className="grid grid-cols-[repeat(7,1fr)_auto] h-14 font-medium text-foreground px-4 items-center">
                <div className="">ID</div>
                <div className="">Target Week</div>
                <div className="">Uploader Name</div>
                <div className="">Submitted Date</div>
                <div className="">Total Drivers</div>
                <div className="">Total Stops</div>
                <div className="">Total Payout</div>
                <div className="w-5"></div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {visibleSubmissions.length > 0 ? (
                <Accordion
                  className="AccordionRoot grid gap-4"
                  type="single"
                  collapsible
                >
                  {visibleSubmissions.map((submission) => (
                    <AccordionItem key={submission.id} className="relative overflow-hidden border-none" value={`item-${submission.id}`}>
                      <div className="border border-foreground/20  hover:bg-purple-600/5 rounded-lg before:absolute before:left-0 before:w-10 before:top-0 before:bottom-0 before:border-s-0 before:rounded-l-lg before:border-purple-600">
                        <AccordionTrigger className="no-underline! shadow-2xl cursor-pointer grid grid-cols-[repeat(7,1fr)_auto] px-4 place-content-center items-center z-0">
                          <div className=" font-medium">{submission.id.slice(0, 8)}</div>
                          <div className="">{submission.target_week}</div>
                          <div className="">{submission.uploader_name}</div>
                          <div className="">{new Date(submission.created_at).toLocaleDateString("en-UK")}</div>
                          <div className=" tabular-nums flex items-center gap-2">
                            <div className="bg-purple-600/30 p-2 rounded-full">
                              <Users size={18} className="text-purple-400" />
                            </div>
                            {submission.total_drivers_processed}
                          </div>
                          <div className=" tabular-nums flex items-center gap-2">
                            <div className="bg-blue-600/30 p-2 rounded-full">
                              <MapPin size={18} className="text-blue-400" />
                            </div>
                            {submission.total_stops_processed.toLocaleString()}
                          </div>
                          <div className=" font-medium tabular-nums w-full ">
                            <Badge
                              variant="outline"
                              className={
                                Number(submission.total_payment) > 50
                                  ? "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300 p-4"
                                  : "p-4"
                              }
                            >
                              £ {submission.total_payment}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="z-20">
                          <TimesheetLayerOne individualTimesheets={individualTimesheets} />
                        </AccordionContent>
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div>
                  <div className="h-24  text-muted-foreground">
                    No timesheets found.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 px-4 pb-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              Viewing {visibleSubmissions.length} out of {filteredSubmissions.length} timesheets
            </p>

            <div className="flex items-center gap-2">
              <label className="text-muted-foreground text-sm" htmlFor="timesheets-page-size">
                Rows per page
              </label>

              <Input
                id="timesheets-page-size"
                className="h-8 w-16 "
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
