export interface ClientRecord {
  id: string;
  account_name: string;
  account_no: string;
  contracts: ContractRecord[]
}

export type ContractRateUnit = "per stop" | "per route" | "per day" | "per hour";
export type ContractStatus = "active" | "upcoming" | "expired";

export interface ContractRecord {
  id: string;
  name: string;
  client: string;
  service: string;
  effective_from: string;
  effective_to: string;
  rate: number;
  rate_type: ContractRateUnit;
  file: string;
  file_name: string;
  file_size: string;
  uploaded_at: string;
  uploaded_by_name: string;
}

const featuredContractTestData: ContractRecord[] = [
  {
    id: "CTR-1008",
    name: "Apex Last Mile 2026",
    clientId: "apex-logistics",
    service: "Last-mile delivery",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    rate: 2.4,
    rateUnit: "per stop",
    fileName: "apex-last-mile-2026.pdf",
    fileSize: "2.4 MB",
    uploadedAt: "2026-01-03T10:20:00.000Z",
    uploadedBy: "Joe W",
  },
  {
    id: "CTR-1007",
    name: "Apex Weekend Premium",
    clientId: "apex-logistics",
    service: "Weekend delivery",
    startDate: "2026-03-01",
    endDate: "2026-12-31",
    rate: 3.1,
    rateUnit: "per stop",
    fileName: "apex-weekend-premium.pdf",
    fileSize: "1.8 MB",
    uploadedAt: "2026-02-24T14:10:00.000Z",
    uploadedBy: "Joe W",
  },
  {
    id: "CTR-1006",
    name: "Apex Delivery Agreement 2025",
    clientId: "apex-logistics",
    service: "Last-mile delivery",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    rate: 2.15,
    rateUnit: "per stop",
    fileName: "apex-delivery-2025.pdf",
    fileSize: "2.1 MB",
    uploadedAt: "2025-01-05T09:15:00.000Z",
    uploadedBy: "Mehmet K",
  },
  {
    id: "CTR-1005",
    name: "Northstar Regional Routes",
    clientId: "northstar-delivery",
    service: "Regional distribution",
    startDate: "2026-02-01",
    endDate: "2027-01-31",
    rate: 185,
    rateUnit: "per route",
    fileName: "northstar-regional-routes.pdf",
    fileSize: "3.2 MB",
    uploadedAt: "2026-01-28T11:45:00.000Z",
    uploadedBy: "Joe W",
  },
  {
    id: "CTR-1004",
    name: "Northstar Peak Season 2026",
    clientId: "northstar-delivery",
    service: "Peak season support",
    startDate: "2026-10-01",
    endDate: "2027-01-15",
    rate: 220,
    rateUnit: "per route",
    fileName: "northstar-peak-season-2026.pdf",
    fileSize: "1.6 MB",
    uploadedAt: "2026-07-18T15:30:00.000Z",
    uploadedBy: "Olivia M",
  },
  {
    id: "CTR-1003",
    name: "Swift Parcel Standard",
    clientId: "swift-parcel",
    service: "Parcel delivery",
    startDate: "2026-04-01",
    endDate: "2027-03-31",
    rate: 2.75,
    rateUnit: "per stop",
    fileName: "swift-parcel-standard.pdf",
    fileSize: "2.7 MB",
    uploadedAt: "2026-03-26T13:05:00.000Z",
    uploadedBy: "Joe W",
  },
  {
    id: "CTR-1002",
    name: "Swift Parcel Driver Support",
    clientId: "swift-parcel",
    service: "Driver support",
    startDate: "2026-01-01",
    endDate: "2026-07-31",
    rate: 145,
    rateUnit: "per day",
    fileName: "swift-driver-support.pdf",
    fileSize: "1.3 MB",
    uploadedAt: "2025-12-22T10:40:00.000Z",
    uploadedBy: "Mehmet K",
  },
  {
    id: "CTR-1001",
    name: "Urban Freight Operations",
    clientId: "urban-freight",
    service: "Freight operations",
    startDate: "2026-05-01",
    endDate: "2027-04-30",
    rate: 24.5,
    rateUnit: "per hour",
    fileName: "urban-freight-operations.pdf",
    fileSize: "4.1 MB",
    uploadedAt: "2026-04-21T16:25:00.000Z",
    uploadedBy: "Joe W",
  },
];

const dayInMilliseconds = 24 * 60 * 60 * 1000;
const generatedRangeStart = Date.UTC(2025, 0, 1);
const generatedRangeEnd = Date.UTC(2026, 7, 6);
const serviceOptions: ReadonlyArray<{
  name: string;
  rateUnit: ContractRateUnit;
  baseRate: number;
}> = [
    { name: "Last-mile delivery", rateUnit: "per stop", baseRate: 2.2 },
    { name: "Regional distribution", rateUnit: "per route", baseRate: 175 },
    { name: "Parcel delivery", rateUnit: "per stop", baseRate: 2.65 },
    { name: "Freight operations", rateUnit: "per hour", baseRate: 23.5 },
    { name: "Driver support", rateUnit: "per day", baseRate: 140 },
    { name: "Weekend delivery", rateUnit: "per stop", baseRate: 3.05 },
  ];

const uploaders = ["Joe W", "Mehmet K", "Olivia M", "Noah P"] as const;

function getTargetContractCount(clientIndex: number) {
  if (clientIndex === 0) {
    return 3;
  }

  if (clientIndex === 1 || clientIndex === 2) {
    return 2;
  }

  if (clientIndex === 3 || clientIndex === 4) {
    return 1;
  }

  if (clientIndex <= 20) {
    return 2;
  }

  if (clientIndex <= 49) {
    return 3;
  }

  return 4;
}


function toIsoDate(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}

const demoDate = "2026-08-06";

export function getContractStatus(contract: ContractRecord): ContractStatus {
  if (contract.startDate > demoDate) {
    return "upcoming";
  }

  if (contract.endDate < demoDate) {
    return "expired";
  }

  return "active";
}
