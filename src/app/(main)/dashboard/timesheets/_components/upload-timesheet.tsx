import { Button } from "@/components/ui/button";
import Rules from "./rules";
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
import { useRef, useState } from "react";
import { Calendar, FileCheck, FileUp, Upload } from "lucide-react";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { returnFileSize } from "@/lib/utils";
import { useRouter } from "next/navigation";
import WeekPicker, { DateRange } from "../../invoices/_components/week-picker";
import { endOfISOWeek, startOfISOWeek } from "date-fns";

export default function UploadTimesheet() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<DateRange>({
    from: startOfISOWeek(new Date()),
    to: endOfISOWeek(new Date()),
  });
  const [isUploading, setIsUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState("");
  const [deriveFromFile, setDeriveFromFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  async function handleFileSelection(event: SubmitEvent) {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    const formatter = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const fromDate = formatter.format(date.from);
    const toDate = formatter.format(date.to);
    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("from_date", fromDate);
      formData.append("to_date", toDate);

      const uploadPromise = fetch("/api/timesheets/upload", {
        method: "POST",
        body: formData,
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("Upload failed");
        }

        return (await response.json()) as {
          message?: string;
          originalFileName?: string;
        };
      });

      toast.promise(uploadPromise, {
        loading: "This might take a few seconds. Processing...",
        success: () => {
          router.refresh();
          return `File has been uploaded. Refresh page.`;
        },
        error: "Error",
      });
    } catch (error) {
      toast.error("Upload failed", {
        className: "border-destructive! text-desctructive!",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.refresh();
      setIsUploading(false);
      setFileSelected("");
      setOpen(false);
    }
  }
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (open === false) setFileSelected("");
        }}
      >
        <DialogTrigger asChild>
          <Button type="button" size="sm" disabled={isUploading}>
            <Upload data-icon="inline-start" />
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload new timesheeet</DialogTitle>
            <DialogDescription>
              Upload the excel sheet and enter the rules the timesheet will use.
            </DialogDescription>
          </DialogHeader>

          <form className="flex flex-col gap-5" onSubmit={handleFileSelection}>
            <div className="flex justify-between items-end">
              <div>
                <FieldLabel htmlFor="date-picker">Choose the week</FieldLabel>
                <WeekPicker
                  disabled={deriveFromFile}
                  value={date}
                  onChange={setDate}
                />
              </div>
              <Button
                disabled
                variant={"outline"}
                className={
                  deriveFromFile
                    ? "border-green-400 bg-green-400/20 hover:bg-green-400/30"
                    : ""
                }
                onClick={() => setDeriveFromFile(!deriveFromFile)}
                title="Derive from file"
              >
                <Calendar />
                From File
              </Button>
              <Rules />
            </div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="contract-file">Timesheet file</FieldLabel>
                <label
                  htmlFor="contract-file"
                  className={
                    "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg " +
                    "border border-dashed bg-muted/30 px-4 py-6 text-center transition-colors hover:bg-muted/50"
                  }
                >
                  {fileSelected ? (
                    <>
                      <span
                        className={
                          "flex size-10 items-center justify-center rounded-lg bg-background " +
                          "ring-1 ring-foreground/10"
                        }
                      >
                        <FileCheck className="size-5 text-green-400" />
                      </span>
                      <span className="text-sm">{`${fileInputRef.current?.files?.[0].name} - ${returnFileSize(fileInputRef.current?.files?.[0].size!)}`}</span>
                    </>
                  ) : (
                    <>
                      <span
                        className={
                          "flex size-10 items-center justify-center rounded-lg bg-background " +
                          "ring-1 ring-foreground/10"
                        }
                      >
                        <FileUp className="size-5 text-muted-foreground" />
                      </span>
                      <span className="font-medium text-sm">Choose a file</span>
                      <span className="text-muted-foreground text-xs">
                        PDF, DOC or DOCX up to 20 MB
                      </span>
                    </>
                  )}
                </label>
                <Input
                  ref={fileInputRef}
                  id="contract-file"
                  type="file"
                  accept=".xlsx, .csv, .xls"
                  className="sr-only"
                  onChange={(e) => {
                    setFileSelected(e.target.files?.[0].name);
                  }}
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Uplaod</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
