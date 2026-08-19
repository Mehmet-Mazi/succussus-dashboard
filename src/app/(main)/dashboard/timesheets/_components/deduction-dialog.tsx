import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Timesheet } from "./driver-timesheet-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { ChangeEvent, SubmitEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CATEGORY = {
  STOP_INCENTIVE: "Per stop incentive to apply",
  FUEL_ALLOWANCE: "Per stop fuel allowance",
  VAN_DEDUCTION: "Van Deductions",
  OTHER_INCENTIVE: "Any other additional incentive",
  BONUS: "Any bonuses",
  OTHER_DEDUCTION: "Any other deduction",
  RATE_CORRECTION: "Rate correction",
} as const;

const ADJUSTMENTTYPE = {
  INCENTIVE: ["Incentive", "OTHER_INCENTIVE"],
  DEDUCTION: ["Deduction", "OTHER_DEDUCTION"],
} as const;

export default function AddDeduction({
  name,
  timesheets,
}: {
  name: string;
  timesheets: Timesheet[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("0.00");

  const getDecimal = (rawValue: string) => {
    let sanitized = rawValue.replace(/[^0-9.]/g, "");

    // 2. Prevent multiple decimal points (e.g., converts "12.34.5" to "12.345")
    const parts = sanitized.split(".");
    if (parts.length > 2) {
      sanitized = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    // 3. Prevent typing more than 2 decimal places (optional but recommended for currency)
    if (parts[1] && parts[1].length > 2) {
      sanitized = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    return sanitized;
  };
  const hanldeCurrency = (event: ChangeEvent<HTMLInputElement>) => {
    let rawValue = event.target.value;

    // 1. Strip away everything that isn't a digit (removes existing $, commas, spaces)
    const digitsOnly = Number(getDecimal(rawValue));
    // const valueInCents = parseFloat(digitsOnly) / 100;

    setAmount(formatCurrency(digitsOnly));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("category", ADJUSTMENTTYPE[formData.get("type")][1]);
    try {
      const response = await fetch("/api/timesheets/adjustments/", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      toast.success(result.message);
    } catch {
      toast.error("Failed to create deduction. Please try again later.");
    } finally {
      setOpen(false);
      window.location.reload();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Add Deduction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a deduction</DialogTitle>
          <DialogDescription>
            Add a deduction for <b>{name}</b>. Please select the date it applies
            too!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel required htmlFor="date-field">
                Adjustment Type
              </FieldLabel>
              <Select required name="type">
                <SelectTrigger>
                  <SelectValue placeholder="Adjustment type" />
                </SelectTrigger>
                <SelectContent position="popper" id="date-field">
                  <SelectGroup>
                    {Object.entries(ADJUSTMENTTYPE).map(([key, value]) => (
                      <SelectItem key={"adjuetment-" + value[0]} value={key}>
                        {value[0]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel required htmlFor="date-field">
                Choose Date
              </FieldLabel>
              <Select required name="timesheet_id">
                <SelectTrigger>
                  <SelectValue placeholder="Select the date to apply to.." />
                </SelectTrigger>
                <SelectContent position="popper" id="date-field">
                  <SelectGroup>
                    {timesheets.map((timesheet) => (
                      <SelectItem
                        key={"timesheet-" + timesheet.id}
                        value={timesheet.id}
                      >
                        {timesheet.date}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel required={true} htmlFor="amount-field">
                Amount
              </FieldLabel>
              <Input
                name="amount"
                required
                id="amount-field"
                type="text"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                onBlur={hanldeCurrency}
                value={getDecimal(amount)}
                onFocus={(e) => e.target.select()}
              />
            </Field>
            <Field>
              <FieldLabel required htmlFor="reason-field">
                Reason
              </FieldLabel>
              <Input required id="reason-field" type="text" name="reason" />
            </Field>
            <Field>
              <FieldLabel htmlFor="input-field">Supporting Evidence</FieldLabel>
              <Input id="file-input" type="file" name="supporting_evidence" />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button>Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
