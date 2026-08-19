import { Button } from "@/components/ui/button";
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
import { InfoIcon, Pencil } from "lucide-react";
import { Timesheet, timesheetFields } from "./driver-timesheet-table";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

function typedEntries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

export default function TimesheetDialog({
  driver,
  timesheet,
}: {
  driver: string;
  timesheet: Timesheet;
}) {
  const [open, setOpen] = useState(false);
  const { id, ...filteredObject } = timesheet;
  const [fields, setFields] = useState<Partial<Timesheet>>(filteredObject);

  const updateItem = (newValue: Partial<Timesheet>) => {
    setFields({ ...fields, ...newValue });
  };

  const updateRequest = () => {
    // TODO: Send update request
    toast.success(`Successfully Updated record`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant={"outline"} size={"xs"}>
          <Pencil size={12} color="red" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-5">
            Driver Timesheet: {timesheet.date.toLocaleString()}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-5">
            <p>
              You are editing <b>{driver}'s</b> timesheet
            </p>
            <div className="text-sm text-destructive flex flex-row border-none gap-2 items-center h-fit">
              <InfoIcon size={16} />
              Notice: all edits will be logged!
            </div>
          </DialogDescription>
        </DialogHeader>
        <div
          className="flex flex-col gap-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              {typedEntries(filteredObject).map(([key, value]) => {
                const field =
                  timesheetFields[key as keyof typeof timesheetFields];
                return (
                  <Field key={key}>
                    <FieldLabel htmlFor={`${key}-field`}>
                      {field.label}
                    </FieldLabel>
                    <Input
                      id={`${key}-field`}
                      defaultValue={String(value)}
                      type={field.type}
                      onChange={(e) => {
                        updateItem({ [key]: e.currentTarget.value });
                      }}
                    />
                  </Field>
                );
              })}
            </div>
          </FieldGroup>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button type="submit" variant={"default"} onClick={updateRequest}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
