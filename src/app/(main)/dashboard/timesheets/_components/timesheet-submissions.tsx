"use client";

import * as React from "react";

import { ChevronDown, ChevronLeft, ChevronRight, Download, ListFilter, Upload } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { timesheetStages, timesheetSubmissions, type TimesheetStage } from "./data";

export function TimesheetSubmissions() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStages, setSelectedStages] = React.useState<TimesheetStage[]>([...timesheetStages]);
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);

  const filteredSubmissions = React.useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();

    return timesheetSubmissions.filter((submission) => {
      const matchesSearch = Object.values(submission).some((value) =>
        String(value).toLowerCase().includes(normalizedQuery),
      );

      return matchesSearch && selectedStages.includes(submission.stage);
    });
  }, [searchQuery, selectedStages]);

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
  function toggleStage(stage: TimesheetStage) {
    setSelectedStages((currentStages) =>
      currentStages.includes(stage)
        ? currentStages.filter((currentStage) => currentStage !== stage)
        : [...currentStages, stage],
    );
    setPageIndex(0);
  }

  function toggleAllStages() {
    setSelectedStages((currentStages) => (currentStages.length === timesheetStages.length ? [] : [...timesheetStages]));
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
              <Button
                type="button"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
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
                    Stage
                    <ChevronDown data-icon="inline-end" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuGroup>
                    <DropdownMenuCheckboxItem
                      checked={selectedStages.length === timesheetStages.length}
                      onCheckedChange={toggleAllStages}
                      onSelect={(event) => event.preventDefault()}
                    >
                      All stages
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    {timesheetStages.map((stage) => (
                      <DropdownMenuCheckboxItem
                        key={stage}
                        checked={selectedStages.includes(stage)}
                        onCheckedChange={() => toggleStage(stage)}
                        onSelect={(event) => event.preventDefault()}
                      >
                        {stage}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 px-0">
          <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 **:data-[slot='table-cell']:py-4">
            <TableHeader className="border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Target Week</TableHead>
                <TableHead>Uploader Name</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead className="text-right">Total Drivers</TableHead>
                <TableHead className="text-right">Total Stops</TableHead>
                <TableHead className="text-right">Earnings</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visibleSubmissions.length > 0 ? (
                visibleSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.id}</TableCell>
                    <TableCell>{submission.targetWeek}</TableCell>
                    <TableCell>{submission.uploaderName}</TableCell>
                    <TableCell>{submission.submittedDate}</TableCell>
                    <TableCell className="text-right tabular-nums">{submission.totalDrivers}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {submission.totalStops.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{submission.earnings}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No timesheets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

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