import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Adjustment, DriverDeductions } from "./driver-timesheet-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Calendar,
  CircleAlert,
  CircleQuestionMark,
  File,
  Paperclip,
  PoundSterling,
  ScanText,
  Tag,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdjustmentInfoDialog({
  adjustment,
}: {
  adjustment: Adjustment;
}) {
  const classType =
    adjustment.type === "INCENTIVE"
      ? "bg-green-300/5 border-green-500 hover:bg-green-300/20"
      : "bg-destructive/5 border-destructive hover:bg-destructive/20";
  return (
    <Dialog>
      <DialogTrigger>
        <Card
          size="sm"
          key={adjustment.id}
          className={`${classType} cursor-pointer border grid grid-cols-[auto_1fr] px-4 gap-0 flex-1 gap-x-3`}
        >
          {adjustment.type === "INCENTIVE" ? (
            <BanknoteArrowUp className="row-span-2 text-green-500" />
          ) : (
            <CircleAlert className="row-span-2 text-destructive" />
          )}
          <CardHeader className="col-start-2 flex justify-between p-0 items-center">
            <CardTitle>{adjustment.type}</CardTitle>
            <CardDescription>
              <Badge className="text-xs bg-destructive text-white ">
                {adjustment.status}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="col-start-2 p-0 justify-start items-start">
            <CardDescription className="text-sm flex justify-between line-clamp-1 text-start">
              {adjustment.reason}
            </CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <div>
          <DialogHeader className="grid grid-cols-[auto_1fr] items-center gap-y-0">
            <div className="bg-primary/30 rounded-full row-span-2 p-2">
              {adjustment.type === "INCENTIVE" ? (
                <BanknoteArrowUp className="size-full text-primary" />
              ) : (
                <BanknoteArrowDown className="size-full text-primary" />
              )}
            </div>
            <DialogTitle className="text-lg capitalize col-start-2 self-end">
              {adjustment.type}
            </DialogTitle>
            <DialogDescription className="col-start-2 self-start">
              {adjustment.category}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-[1fr_1fr] pt-3">
            <GridItem
              title="Amount"
              icon={<Tag />}
              value={"£" + adjustment.amount}
            />
            <GridItem
              title="Reason"
              icon={<ScanText />}
              value={adjustment.reason}
            />
            <GridItem
              title="Status"
              icon={<CircleQuestionMark />}
              value={adjustment.status}
            />
            <GridItem
              title="Date Issued"
              icon={<Calendar />}
              value={adjustment.date}
            />
            <GridItem
              title="File"
              icon={<Paperclip />}
              value={
                <Button asChild variant={"outline"} size="xs">
                  <Link href="#">
                    <File />
                    View Evidence
                  </Link>
                </Button>
              }
            />
            <div className="col-span-full flex justify-end pt-3">
              <Button asChild variant={"default"} size="sm">
                <Link href="#">
                  <Trash />
                  Delete
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GridItem({
  title,
  icon,
  value,
}: {
  title: string;
  icon?: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <>
      <CardTitle className="flex text-sm items-center gap-1.5 py-3">
        <div className="*:size-4 bg-primary/30 p-1 rounded *:text-primary">
          {icon}
        </div>
        {title}
      </CardTitle>
      <CardDescription className="self-center py-3">{value}</CardDescription>
      <GridLine />
    </>
  );
}

function GridLine() {
  return <div className="col-span-full h-0.5 bg-primary/30 w-full" />;
}
