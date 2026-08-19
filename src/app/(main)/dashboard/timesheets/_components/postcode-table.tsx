import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, CornerLeftUpIcon, PencilLine, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export type PostcodeRate = {
  id: string;
  date: string;
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
      row.id === postcode.id ? { ...row, ...value } : row,
    );
    setEditPostcode(newRates);
    onChange(newRates);
  };

  const addPostcodeRate = () => {
    const newRates = [
      ...editPostcode,
      {
        date: new Date().toLocaleDateString("en-UK"),
        id: crypto.randomUUID(),
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
      <Table className="mt-3 table-fixed w-full **:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 **:data-[slot='table-cell']:py-4">
        <TableHeader className="sticky top-0 left-0 border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground">
          <TableRow>
            <TableHead className="bg-background text-center">
              Active From
            </TableHead>
            <TableHead className="bg-background text-center">
              Postcode
            </TableHead>
            <TableHead className="bg-background text-center">Rate</TableHead>
            <TableHead className="bg-background text-center">Edit</TableHead>
            <TableHead className="bg-background text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="w-full overflow-auto">
          {editPostcode.length > 0 ? (
            editPostcode.map((postcode, index) => (
              <TableRow key={postcode.id}>
                <TableCell className="text-center font-medium">
                  {postcode.date}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {editingKey === postcode.id ? (
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
                  {editingKey === postcode.id ? (
                    <Input
                      type="number"
                      onInput={(e) =>
                        inputHandler(postcode, { rate: e.currentTarget.value })
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
                    onClick={() => editHandler(postcode.id)}
                  >
                    {editingKey == postcode.id ? (
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
                    onClick={() => deleteRow(postcode.id)}
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
