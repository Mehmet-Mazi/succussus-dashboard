"use client";

import * as React from "react";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  Download,
  Ellipsis,
  FileText,
  Search,
  Trash,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AddContractDialog } from "./add-contract-dialog";
import {
  type ContractRecord,
  type ContractStatus,
  getContractStatus,
  ClientRecord,
} from "./contract-data";
import { ContractDetailsDialog } from "./contract-details-dialog";
import { useRouter } from "next/navigation";

const contractViews = ["client", "contract"] as const;

type ContractView = (typeof contractViews)[number];

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

function isContractView(value: string): value is ContractView {
  return contractViews.includes(value as ContractView);
}

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

function matchesContractSearch(
  contract: ContractRecord,
  client: ClientRecord | undefined,
  normalizedQuery: string,
) {

  return [contract.name, contract.id, contract.name, client?.account_name]
    .filter(Boolean)
    .some((value) => String(value)?.toLowerCase().includes(normalizedQuery));
}

interface ContractRowProps {
  contract: ContractRecord;
  client: ClientRecord | undefined;
  showClient: boolean;
  nested?: boolean;
  onView: (contract: ContractRecord) => void;
  onDownload: (contract: ContractRecord) => void;
}

function ContractRow({
  contract,
  client,
  showClient,
  nested = false,
  onView,
  onDownload,
}: ContractRowProps) {
  const status = getContractStatus(contract);

  return (
    <TableRow className={nested ? "bg-muted/20" : undefined}>
      <TableCell>
        <div
          className={
            nested
              ? "flex min-w-0 items-center gap-3 pl-8"
              : "flex min-w-0 items-center gap-3"
          }
        >
          {nested ? (
            <CornerDownRight className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <div
              className={
                "flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 " +
                "dark:bg-red-950/50 dark:text-red-300"
              }
            >
              <FileText className="size-4" />
            </div>
          )}
          <div className="min-w-0">
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto max-w-64 justify-start px-0"
              onClick={() => onView(contract)}
            >
              <span className="truncate">{contract.name}</span>
            </Button>
          </div>
        </div>
      </TableCell>
      {showClient && <TableCell>{client?.account_name}</TableCell>}
      <TableCell className="text-muted-foreground">
        {formatDate(contract.effective_from)} – {formatDate(contract.effective_to)}
      </TableCell>
      <TableCell>{contract.service}</TableCell>
      <TableCell className="font-medium tabular-nums">
        £{contract.rate} / {contract.rate_type}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={statusClasses[status]}>
          {formatStatus(status)}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              aria-label={`Actions for ${contract.name}`}
            >
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onView(contract)}>
              <FileText />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDownload(contract)}>
              <Download />
              Download contract
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDownload(contract)}
            >
              <Trash />
              Delete Contract
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function ContractVault({ clientData }: { clientData: ClientRecord[] }) {
  const router = useRouter()
  const [view, setView] = React.useState<ContractView>("client");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedClientIds, setExpandedClientIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [selectedContract, setSelectedContract] =
    React.useState<ContractRecord | null>(null);
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleContracts = clientData.flatMap(client => client.contracts.filter((contract) => (
    matchesContractSearch(contract, client, normalizedQuery)
  )
  ));
  const visibleClients = clientData.filter((client) => {
    const clientContracts = client.contracts.filter(
      (contract) => contract.client === client.id,
    );
    const clientMatches = client.account_name.toLowerCase().includes(normalizedQuery);

    return (
      clientMatches ||
      clientContracts.some((contract) =>
        matchesContractSearch(contract, client, normalizedQuery),
      )
    );
  });
  const totalVisibleItems =
    view === "client" ? visibleClients.length : visibleContracts.length;
  const pageCount = Math.max(1, Math.ceil(totalVisibleItems / pageSize));
  const currentPageIndex = Math.min(pageIndex, pageCount - 1);
  const pageStart = currentPageIndex * pageSize;
  const paginatedClients = visibleClients.slice(
    pageStart,
    pageStart + pageSize,
  );
  const paginatedContracts = visibleContracts.slice(
    pageStart,
    pageStart + pageSize,
  );
  const visibleItemCount =
    view === "client" ? paginatedClients.length : paginatedContracts.length;

  const selectedContractClient =
    clientData.find(
      (client) => client.id === selectedContract?.client,
    ) ?? null;
  const selectedContractStatus = selectedContract
    ? getContractStatus(selectedContract)
    : null;

  function toggleClient(client: string) {
    setExpandedClientIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(client)) {
        nextIds.delete(client);
      } else {
        nextIds.add(client);
      }

      return nextIds;
    });
  }

  function previewDownload(contract: ContractRecord) {
    router.push(contract.file)
    toast.info(
      `Download for ${contract.file_name} will begin shortly.`,
    );
  }

  function updatePageSize(value: string) {
    const nextPageSize = Number(value);

    if (
      Number.isInteger(nextPageSize) &&
      nextPageSize >= 1 &&
      nextPageSize <= 100
    ) {
      setPageSize(nextPageSize);
      setPageIndex(0);
    }
  }

  console.log(clientData)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl leading-none tracking-tight">
            Contract Vault
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage client contracts and the rates used to generate invoices.
          </p>
        </div>
        <AddContractDialog clientData={clientData} />
      </div>

      <section
        className="flex flex-col gap-3"
        aria-labelledby="contracts-heading"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">

          <InputGroup className="md:max-w-sm">
            <InputGroupInput
              value={searchQuery}
              placeholder={
                view === "client" ? "Search clients..." : "Search contracts..."
              }
              aria-label={
                view === "client" ? "Search clients" : "Search contracts"
              }
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPageIndex(0);
              }}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-4 px-0">
            {view === "client" ? (
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30ch]">
                      Client / Contract
                    </TableHead>
                    <TableHead className="w-[20ch]">Term</TableHead>
                    <TableHead className="w-[15ch]">Service</TableHead>
                    <TableHead className="w-[15ch]">Rate</TableHead>
                    <TableHead className="w-[15ch]">Status</TableHead>
                    <TableHead className="w-[10ch] text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClients.length > 0 ? (
                    paginatedClients.map((client) => {
                      const allClientContracts = clientData.flatMap(client => client.contracts.filter(
                        (contract) => contract.client === client.id,
                      ));
                      const clientNameMatches = client.account_name
                        .toLowerCase()
                        .includes(normalizedQuery);
                      const clientContracts = clientNameMatches
                        ? allClientContracts
                        : allClientContracts.filter((contract) =>
                          matchesContractSearch(
                            contract,
                            client,
                            normalizedQuery,
                          ),
                        );
                      const activeContracts = allClientContracts.filter(
                        (contract) =>
                          getContractStatus(contract) === "active",
                      ).length;
                      const isExpanded =
                        expandedClientIds.has(client.id) ||
                        (normalizedQuery.length > 0 &&
                          clientContracts.length > 0);

                      return (
                        <React.Fragment key={client.id}>
                          <TableRow className="bg-muted/30 hover:bg-muted/50">
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                className="h-auto justify-start px-2 py-1.5"
                                aria-expanded={isExpanded}
                                onClick={() => toggleClient(client.id)}
                              >
                                {isExpanded ? (
                                  <ChevronDown />
                                ) : (
                                  <ChevronRight />
                                )}
                                <span className="font-semibold">
                                  {client.account_name}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  {client.contracts.length} contracts
                                </span>
                              </Button>
                            </TableCell>
                            <TableCell
                              colSpan={3}
                              className="text-muted-foreground"
                            ></TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {client.contracts.length} active
                              </Badge>
                            </TableCell>
                            <TableCell />
                          </TableRow>

                          {isExpanded &&
                            client.contracts.map((contract) => (
                              <ContractRow
                                key={contract.id}
                                contract={contract}
                                client={client}
                                showClient={false}
                                nested
                                onView={setSelectedContract}
                                onDownload={previewDownload}
                              />
                            ))}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-28 text-center text-muted-foreground"
                      >
                        No clients found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContracts.length > 0 ? (
                    paginatedContracts.map((contract) => (
                      <ContractRow
                        key={contract.id}
                        contract={contract}
                        client={clientData.find(
                          (client) => client.id === contract.id,
                        )}
                        showClient
                        onView={setSelectedContract}
                        onDownload={previewDownload}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-28 text-center text-muted-foreground"
                      >
                        No contracts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}

            <div className="flex flex-col gap-3 px-4 pb-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground text-sm">
                Viewing {visibleItemCount} out of {totalVisibleItems}{" "}
                {view === "client" ? "clients" : "contracts"}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <label
                  className="text-muted-foreground text-sm"
                  htmlFor="contracts-page-size"
                >
                  Rows per page
                </label>

                <Input
                  id="contracts-page-size"
                  className="h-8 w-16 text-center"
                  type="number"
                  min="1"
                  max="100"
                  value={pageSize}
                  onChange={(event) => updatePageSize(event.target.value)}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPageIndex === 0}
                  onClick={() =>
                    setPageIndex((currentIndex) => currentIndex - 1)
                  }
                >
                  <ChevronLeft />
                  Previous
                </Button>

                <span className="flex size-8 items-center justify-center rounded-md bg-muted text-sm">
                  {currentPageIndex + 1}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPageIndex >= pageCount - 1}
                  onClick={() =>
                    setPageIndex((currentIndex) => currentIndex + 1)
                  }
                >
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <ContractDetailsDialog
        contract={selectedContract}
        client={selectedContractClient}
        status={selectedContractStatus}
        open={selectedContract !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedContract(null);
          }
        }}
        onDownload={() => {
          if (selectedContract) {
            previewDownload(selectedContract);
          }
        }}
      />
    </div>
  );
}
