"use client";

import * as React from "react";

import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { CalendarIcon, FileUp, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { contractClients } from "./contract-data";

export function AddContractDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus data-icon="inline-start" />
          Add contract
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add a new contract</DialogTitle>
          <DialogDescription>
            Upload the signed contract and enter the rules the invoice generator will use.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="contract-file">Contract file</FieldLabel>
              <label
                htmlFor="contract-file"
                className={
                  "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg " +
                  "border border-dashed bg-muted/30 px-4 py-6 text-center transition-colors hover:bg-muted/50"
                }
              >
                <span
                  className={
                    "flex size-10 items-center justify-center rounded-lg bg-background " +
                    "ring-1 ring-foreground/10"
                  }
                >
                  <FileUp className="size-5 text-muted-foreground" />
                </span>
                <span className="font-medium text-sm">Choose a contract file</span>
                <span className="text-muted-foreground text-xs">PDF, DOC or DOCX up to 20 MB</span>
              </label>
              <Input id="contract-file" type="file" accept=".pdf,.doc,.docx" className="sr-only" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="contract-client">Client</FieldLabel>
                <Select>
                  <SelectTrigger id="contract-client" className="w-full">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="contract-name">Contract name</FieldLabel>
                <Input id="contract-name" placeholder="e.g. Last Mile 2026" />
              </Field>

              <Field>
                <FieldLabel htmlFor="contract-start-date">Start date</FieldLabel>
                <ContractDatePicker id="contract-start-date" />
              </Field>

              <Field>
                <FieldLabel htmlFor="contract-end-date">End date</FieldLabel>
                <ContractDatePicker id="contract-end-date" />
              </Field>

              <Field>
                <FieldLabel htmlFor="contract-service">Service</FieldLabel>
                <Select>
                  <SelectTrigger id="contract-service" className="w-full">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-mile">Last-mile delivery</SelectItem>
                    <SelectItem value="regional">Regional distribution</SelectItem>
                    <SelectItem value="parcel">Parcel delivery</SelectItem>
                    <SelectItem value="freight">Freight operations</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid grid-cols-[1fr_8rem] gap-2">
                <Field>
                  <FieldLabel htmlFor="contract-rate">Rate</FieldLabel>
                  <Input id="contract-rate" type="number" min="0" step="0.01" placeholder="0.00" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="contract-rate-unit">Unit</FieldLabel>
                  <Select defaultValue="per-stop">
                    <SelectTrigger id="contract-rate-unit" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per-stop">Per stop</SelectItem>
                      <SelectItem value="per-route">Per route</SelectItem>
                      <SelectItem value="per-day">Per day</SelectItem>
                      <SelectItem value="per-hour">Per hour</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">Add contract</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ContractDatePicker({ id }: { id: string }) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          data-empty={!date}
          className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "d MMM yyyy", { locale: enGB }) : "Select date"}
          <CalendarIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Calendar
          className="w-full"
          mode="single"
          locale={enGB}
          selected={date}
          defaultMonth={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) {
              return;
            }

            setDate(selectedDate);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
