"use client";

import { CalendarDays, Download, FileText, PoundSterling } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { returnFileSize } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import type { ClientRecord, ContractRecord, ContractStatus } from "./contract-data";
import Link from "next/link";

interface ContractDetailsDialogProps {
  contract: ContractRecord | null;
  client: ClientRecord | null;
  status: ContractStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
}

const statusClasses: Record<ContractStatus, string> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700 " +
    "dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  upcoming:
    "border-blue-200 bg-blue-50 text-blue-700 " +
    "dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
  expired:
    "border-slate-200 bg-slate-50 text-slate-700 " +
    "dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300",
};

function formatStatus(status: ContractStatus) {
  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function ContractDetailsDialog({
  contract,
  client,
  status,
  open,
  onOpenChange,
  onDownload,
}: ContractDetailsDialogProps) {
  if (!contract || !client || !status) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-start gap-3 pr-8">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
            >
              <FileText className="size-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <DialogTitle>{contract.name}</DialogTitle>
              <DialogDescription>{client.account_name}</DialogDescription>
            </div>
            <Badge variant="outline" className={statusClasses[status]}>
              {formatStatus(status)}
            </Badge>
          </div>
        </DialogHeader>

        <Separator />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground text-xs">
              <FileText className="size-3.5" />
              Service
            </div>
            <p className="font-medium">{contract.name}</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground text-xs">
              <PoundSterling className="size-3.5" />
              Standard rate
            </div>
            <p className="font-medium">
              £{contract.rate} / {contract.rate_type}
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3 sm:col-span-2">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground text-xs">
              <CalendarDays className="size-3.5" />
              Contract term
            </div>
            <p className="font-medium">
              {formatDate(contract.effective_from)} – {formatDate(contract.effective_to)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={
                  "flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 " +
                  "dark:bg-red-950/50 dark:text-red-300"
                }
              >
                <FileText className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{contract.file_name}</p>
                <p className="text-muted-foreground text-xs">
                  {returnFileSize(Number(contract.file_size))} · Uploaded by {contract.uploaded_by_name}
                </p>
              </div>
            </div>
            <Button asChild type="button" variant="outline" size="sm" onClick={onDownload}>
              <Link href={contract.file}>
                <Download data-icon="inline-start" />
                Download
              </Link>
            </Button>
          </div>
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
