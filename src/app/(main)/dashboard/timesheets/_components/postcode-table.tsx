import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, CornerLeftUpIcon, PencilLine, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

export type PostcodeRate = {
  fieldId: string;
  id?: string;
  effective_from: string;
  postcode: string;
  rate: string | number;
};

type ChangeRecord = {
  action: "updated" | "deleted";
  original: PostcodeRate;
  updated?: PostcodeRate;
};

export default function PostcodeTable({
  postcodeRates,
  onChange,
}: {
  postcodeRates: PostcodeRate[];
  onChange: (changes: PostcodeRate[]) => void;
}) {
  const [editPostcode, setEditPostcode] = useState(postcodeRates);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const editHandler = (key: string) => {
    if (editingKey === key) {
      setEditingKey(null);
    } else {
      setEditingKey(key);
    }
  };

  const deleteRow = (id: string) => {
    const newRates = editPostcode.filter((value) => value.id !== id);
    setEditPostcode(newRates);
    onChange(newRates);
  };

  const inputHandler = (
    postcode: PostcodeRate,
    value: Partial<PostcodeRate>,
  ) => {
    const newRates = editPostcode.map((row) =>
      row.fieldId === postcode.fieldId ? { ...row, ...value } : row,
    );
    setEditPostcode(newRates);
    onChange(newRates);
  };

  const addPostcodeRate = () => {
    const newRates = [
      ...editPostcode,
      {
        fieldId: crypto.randomUUID(),
        effective_from: format(new Date(), "yyyy-MM-dd"),
        postcode: "",
        rate: 0,
      },
    ];
    setEditPostcode(newRates);
    onChange(newRates);
  };

  return (
    <div className="max-h-80 w-full overflow-auto">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm">
          Postcodes
        </h1>
        <div>
          <Button size={"sm"} onClick={addPostcodeRate}>
            + Add
          </Button>
        </div>
      </div>
      <Table className="mt-3 table-fixed w-full ">
        <TableHeader className="w-full sticky top-0 left-0 border-t">
          <TableRow className="w-full">
            <TableHead className="bg-background text-center w-1/5">
              Active From
            </TableHead>
            <TableHead className="bg-background text-center w-1/5">
              Postcode
            </TableHead>
            <TableHead className="bg-background text-center w-1/5">Rate</TableHead>
            <TableHead className="bg-background text-center w-1/5">Edit</TableHead>
            <TableHead className="bg-background text-center w-1/5">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="w-full overflow-auto">
          {editPostcode.length > 0 ? (
            editPostcode.map((postcode, index) => (
              <TableRow key={postcode.fieldId} data-value={postcode.fieldId}>
                <TableCell className="text-center font-medium overflow-visible">
                  {
                    format(postcode.effective_from, "yyyy-MM-dd")
                  }
                </TableCell>
                <TableCell className="text-center font-medium">
                  {editingKey === postcode.fieldId ? (
                    <Input
                      type="text"
                      onInput={(e) =>
                        inputHandler(postcode, {
                          postcode: e.currentTarget.value,
                        })
                      }
                      defaultValue={postcode.postcode}
                    />
                  ) : postcode.postcode.length === 0 ? (
                    "--"
                  ) : (
                    postcode.postcode
                  )}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {editingKey === postcode.fieldId ? (
                    <Input
                      type="number"
                      onInput={(e) =>
                        inputHandler(postcode, { rate: Number(e.currentTarget.value) })
                      }
                      defaultValue={postcode.rate}
                    />
                  ) : (
                    postcode.rate
                  )}
                </TableCell>
                <TableCell className="text-center font-medium ">
                  <Button
                    variant="outline"
                    size={"sm"}
                    className="cursor-pointer"
                    onClick={() => editHandler(postcode.fieldId)}
                  >
                    {editingKey == postcode.fieldId ? (
                      <Check className="text-green-500 font-extrabold" />
                    ) : (
                      <PencilLine />
                    )}
                  </Button>
                </TableCell>

                <TableCell className="text-center font-medium ">
                  <Button
                    variant="destructive"
                    size={"sm"}
                    className="cursor-pointer"
                    onClick={() => deleteRow(postcode.fieldId)}
                    disabled
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                No postcode found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


function CalenderDatePicker({ date, setDate }: { date: Date; setDate: (date: Date) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-empty={!date}
          className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "dd MMM yyyy", { locale: enGB }) : "Select date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
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
