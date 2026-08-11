import { type TimesheetSubmission, type Timesheetstatus, timesheetStatus } from "./data";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@base-ui/react";
import { Pencil } from "lucide-react";
import { useMemo, useState } from "react";

export interface TimesheetDetail {
  date: string | Date;
  route_number: number;
  postcode: string;
  cons: number;
  stop_rate: number;
  fuel: number;
  incentive: number;
  fuel_total: number;
  incentive_total: number;
  deductions: number;
  total_stop_pay: number;
  total_pay: number;
}

export type IndividualTimesheets = Record<string, TimesheetDetail[]>;

export default function TimesheetLayerOne({ individualTimesheets }: { individualTimesheets: IndividualTimesheets }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();

    return Object.entries(individualTimesheets)
      .reduce((accumulator, [key, detailsArray]) => {

        // Filter the array by checking the key AND every value inside the detail object
        const matchedDetails = detailsArray.filter((detail) => {
          // 1. Check if the dictionary key matches
          const keyMatches = key.toLowerCase().includes(normalizedQuery);

          // 2. Check if ANY value inside the timesheet detail matches
          const valueMatches = Object.values(detail).some((value) =>
            String(value).toLowerCase().includes(normalizedQuery)
          );

          return keyMatches || valueMatches;
        });

        // Only add to final result if there are matching rows
        if (matchedDetails.length > 0) {
          accumulator[key] = matchedDetails;
        }

        return accumulator;
      }, {} as Record<string, TimesheetDetail[]>);
  }, [individualTimesheets, searchQuery]);

  console.log("visible submissions:", filteredSubmissions)

  return (
    <AccordionContent className="z-40">
      <div className="flex justify-between items-center px-4 z-30">
        <div className="col-start-1">
          <CardTitle >Driver Timesheets</CardTitle>
          <CardDescription>Inspect individual timesheets </CardDescription>
        </div>
        <Input
          className="h-8 w-48 md:w-56 col-start-7"
          placeholder="Search timesheets..."
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setPageIndex(0);
          }}
        />
      </div>
      <div className="p-4 grid grid-cols-[repeat(7,1fr)_auto] items-center ">
        <div className="">Driver</div>
        <div className="">Date</div>
        <div className="">Fuel Allowance</div>
        <div className="">Incentive</div>
        <div className="">Route Number</div>
        <div className="">Total Stops</div>
        <div className="">Total Payment</div>
        <div className="w-5"><Pencil className="cursor-pointer" size="18" color="red" /></div>
      </div>
      {Object.entries(filteredSubmissions).map(([name, row]) => {

        return row.map((timesheet) => (

          <div className="p-4 grid grid-cols-[repeat(7,1fr)_auto] items-center hover:bg-white/20" key={timesheet.date.toLocaleString()}>
            <div className="">{name}</div>
            <div className="">{timesheet.total_pay}</div>
            <div className="">Fuel Allowance</div>
            <div className="">Incentive</div>
            <div className="">Route Number</div>
            <div className="">Total Stops</div>
            <div className="">Total Payment</div>
            <div className="w-5"><Pencil className="cursor-pointer" size="18" color="red" /></div>
          </div>
        ))


      })}
    </AccordionContent>
  )
}
