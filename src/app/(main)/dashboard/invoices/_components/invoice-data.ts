export const invoiceStatuses = ["paid", "invoice_sent", "unfulfilled", "pending"] as const;

export type InvoiceStatus = (typeof invoiceStatuses)[number];

export interface InvoiceRecord {
  invoice: string;
  driver: string;
  statuses: [InvoiceStatus, InvoiceStatus];
  total: number;
  date: string;
}

export const invoiceTestData: InvoiceRecord[] = [
  {
    invoice: "#14550",
    driver: "Emma Smith",
    statuses: ["invoice_sent", "pending"],
    total: 248,
    date: "2026-05-09T15:42:00.000Z",
  },
  {
    invoice: "#14551",
    driver: "Oliver Jones",
    statuses: ["paid", "invoice_sent"],
    total: 312.5,
    date: "2026-05-10T08:15:00.000Z",
  },
  {
    invoice: "#14552",
    driver: "Amelia Brown",
    statuses: ["unfulfilled", "pending"],
    total: 196.75,
    date: "2026-05-11T12:30:00.000Z",
  },
  {
    invoice: "#14553",
    driver: "George Taylor",
    statuses: ["paid", "unfulfilled"],
    total: 425,
    date: "2026-05-12T10:05:00.000Z",
  },
  {
    invoice: "#14554",
    driver: "Isla Wilson",
    statuses: ["paid", "pending"],
    total: 284.2,
    date: "2026-05-13T14:20:00.000Z",
  },
  {
    invoice: "#14555",
    driver: "Harry Davies",
    statuses: ["invoice_sent", "pending"],
    total: 359.99,
    date: "2026-05-14T16:45:00.000Z",
  },
  {
    invoice: "#14556",
    driver: "Ava Evans",
    statuses: ["paid", "invoice_sent"],
    total: 510,
    date: "2026-05-15T07:50:00.000Z",
  },
  {
    invoice: "#14557",
    driver: "Jack Thomas",
    statuses: ["unfulfilled", "pending"],
    total: 175.4,
    date: "2026-05-16T11:10:00.000Z",
  },
  {
    invoice: "#14558",
    driver: "Mia Roberts",
    statuses: ["paid", "unfulfilled"],
    total: 640.25,
    date: "2026-05-17T13:55:00.000Z",
  },
  {
    invoice: "#14559",
    driver: "Charlie Johnson",
    statuses: ["paid", "pending"],
    total: 298,
    date: "2026-05-18T09:35:00.000Z",
  },
  {
    invoice: "#14560",
    driver: "Sophia Walker",
    statuses: ["invoice_sent", "pending"],
    total: 382.6,
    date: "2026-05-19T15:25:00.000Z",
  },
  {
    invoice: "#14561",
    driver: "Thomas Wright",
    statuses: ["paid", "invoice_sent"],
    total: 455.9,
    date: "2026-05-20T08:40:00.000Z",
  },
  {
    invoice: "#14562",
    driver: "Lily Thompson",
    statuses: ["unfulfilled", "pending"],
    total: 220,
    date: "2026-05-21T12:05:00.000Z",
  },
  {
    invoice: "#14563",
    driver: "Oscar White",
    statuses: ["paid", "unfulfilled"],
    total: 530.45,
    date: "2026-05-22T14:50:00.000Z",
  },
  {
    invoice: "#14564",
    driver: "Grace Harris",
    statuses: ["paid", "pending"],
    total: 267.8,
    date: "2026-05-23T10:30:00.000Z",
  },
  {
    invoice: "#14565",
    driver: "Leo Martin",
    statuses: ["invoice_sent", "pending"],
    total: 344,
    date: "2026-05-24T16:10:00.000Z",
  },
  {
    invoice: "#14566",
    driver: "Freya Jackson",
    statuses: ["paid", "invoice_sent"],
    total: 612.3,
    date: "2026-05-25T07:25:00.000Z",
  },
  {
    invoice: "#14567",
    driver: "Alfie Clarke",
    statuses: ["unfulfilled", "pending"],
    total: 188.95,
    date: "2026-05-26T11:45:00.000Z",
  },
  {
    invoice: "#14568",
    driver: "Emily Lewis",
    statuses: ["paid", "unfulfilled"],
    total: 476,
    date: "2026-05-27T13:20:00.000Z",
  },
  {
    invoice: "#14569",
    driver: "Noah Robinson",
    statuses: ["paid", "pending"],
    total: 325.5,
    date: "2026-05-28T09:10:00.000Z",
  },
  {
    invoice: "#14570",
    driver: "Ella Wood",
    statuses: ["invoice_sent", "pending"],
    total: 401.25,
    date: "2026-05-29T15:35:00.000Z",
  },
  {
    invoice: "#14571",
    driver: "Arthur Hall",
    statuses: ["paid", "invoice_sent"],
    total: 558,
    date: "2026-05-30T08:55:00.000Z",
  },
  {
    invoice: "#14572",
    driver: "Evie Green",
    statuses: ["unfulfilled", "pending"],
    total: 205.6,
    date: "2026-05-31T12:15:00.000Z",
  },
  {
    invoice: "#14573",
    driver: "Henry Baker",
    statuses: ["paid", "unfulfilled"],
    total: 495.75,
    date: "2026-06-01T14:40:00.000Z",
  },
  {
    invoice: "#14574",
    driver: "Poppy Adams",
    statuses: ["paid", "pending"],
    total: 276,
    date: "2026-06-02T10:25:00.000Z",
  },
  {
    invoice: "#14575",
    driver: "Archie Nelson",
    statuses: ["invoice_sent", "pending"],
    total: 367.4,
    date: "2026-06-03T16:30:00.000Z",
  },
  {
    invoice: "#14576",
    driver: "Sophie Carter",
    statuses: ["paid", "invoice_sent"],
    total: 584.2,
    date: "2026-06-04T07:40:00.000Z",
  },
  {
    invoice: "#14577",
    driver: "Theo Mitchell",
    statuses: ["unfulfilled", "pending"],
    total: 214.85,
    date: "2026-06-05T11:25:00.000Z",
  },
  {
    invoice: "#14578",
    driver: "Daisy Turner",
    statuses: ["paid", "unfulfilled"],
    total: 520,
    date: "2026-06-06T13:45:00.000Z",
  },
  {
    invoice: "#14579",
    driver: "William Phillips",
    statuses: ["paid", "pending"],
    total: 309.95,
    date: "2026-06-07T09:20:00.000Z",
  },
];
