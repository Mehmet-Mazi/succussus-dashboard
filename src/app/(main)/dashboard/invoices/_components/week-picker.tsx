import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addWeeks,
  endOfISOWeek,
  format,
  startOfISOWeek,
  subWeeks,
} from "date-fns";

export type DateRange = {
  from: Date;
  to: Date;
};

export default function WeekPicker({
  value,
  disabled = false,
  onChange,
}: {
  value?: DateRange;
  disabled: boolean;
  onChange: (value: DateRange) => void;
}) {
  const currentWeek = value?.from ?? new Date();

  const setWeek = (date: Date) => {
    onChange({
      from: startOfISOWeek(date),
      to: endOfISOWeek(date),
    });
  };

  return (
    <ButtonGroup>
      <Button
        disabled={disabled}
        size="icon"
        variant="outline"
        type="button"
        onClick={() => setWeek(subWeeks(currentWeek, 1))}
      >
        <ChevronLeft />
      </Button>

      <Button
        disabled={disabled}
        type="button"
        variant="outline"
        className="w-[12ch]"
        onClick={() => setWeek(new Date())}
      >
        {format(startOfISOWeek(currentWeek), "d MMM")} –{" "}
        {format(endOfISOWeek(currentWeek), "d MMM")}
      </Button>

      <Button
        disabled={disabled}
        type="button"
        size="icon"
        variant="outline"
        onClick={() => setWeek(addWeeks(currentWeek, 1))}
      >
        <ChevronRight />
      </Button>
    </ButtonGroup>
  );
}
