export const invoiceStatuses = [
  "paid",
  "invoice_sent",
  "unfulfilled",
  "pending",
] as const;

export type InvoiceStatus = (typeof invoiceStatuses)[number];

export interface InvoiceRecord {
  id: string;
  driver: string;
  status: InvoiceStatus;
  total: number;
  date: string;
}

export const invoiceTestData: InvoiceRecord[] = [
  {
    id: "#14550",
    driver: "Emma Smith",
    status: "paid",
    total: 248,
    date: "2026-05-09T15:42:00.000Z",
  },
  {
    id: "#14551",
    driver: "Oliver Jones",
    status: "pending",
    total: 312.5,
    date: "2026-05-10T08:15:00.000Z",
  },
  {
    id: "#14552",
    driver: "Amelia Brown",
    status: "unfulfilled",
    total: 196.75,
    date: "2026-05-11T12:30:00.000Z",
  },
  {
    id: "#14553",
    driver: "George Taylor",
    status: "pending",
    total: 425,
    date: "2026-05-12T10:05:00.000Z",
  },
  {
    id: "#14554",
    driver: "Isla Wilson",
    status: "pending",
    total: 284.2,
    date: "2026-05-13T14:20:00.000Z",
  },
  {
    id: "#14555",
    driver: "Harry Davies",
    status: "pending",
    total: 359.99,
    date: "2026-05-14T16:45:00.000Z",
  },
  {
    id: "#14556",
    driver: "Ava Evans",
    status: "pending",
    total: 510,
    date: "2026-05-15T07:50:00.000Z",
  },
  {
    id: "#14558",
    driver: "Mia Roberts",
    status: "pending",
    total: 640.25,
    date: "2026-05-17T13:55:00.000Z",
  },
  {
    id: "#14559",
    driver: "Charlie Johnson",
    status: "pending",
    total: 298,
    date: "2026-05-18T09:35:00.000Z",
  },
  {
    id: "#14560",
    driver: "Sophia Walker",
    status: "pending",
    total: 382.6,
    date: "2026-05-19T15:25:00.000Z",
  },
  {
    id: "#14561",
    driver: "Thomas Wright",
    status: "pending",
    total: 455.9,
    date: "2026-05-20T08:40:00.000Z",
  },
  {
    id: "#14562",
    driver: "Lily Thompson",
    status: "pending",
    total: 220,
    date: "2026-05-21T12:05:00.000Z",
  },
  {
    id: "#14563",
    driver: "Oscar White",
    status: "pending",
    total: 530.45,
    date: "2026-05-22T14:50:00.000Z",
  },
  {
    id: "#14564",
    driver: "Grace Harris",
    status: "pending",
    total: 267.8,
    date: "2026-05-23T10:30:00.000Z",
  },
  {
    id: "#14565",
    driver: "Leo Martin",
    status: "pending",
    total: 344,
    date: "2026-05-24T16:10:00.000Z",
  },
  {
    id: "#14566",
    driver: "Freya Jackson",
    status: "pending",
    total: 612.3,
    date: "2026-05-25T07:25:00.000Z",
  },
  {
    id: "#14567",
    driver: "Alfie Clarke",
    status: "pending",
    total: 188.95,
    date: "2026-05-26T11:45:00.000Z",
  },
  {
    id: "#14568",
    driver: "Emily Lewis",
    status: "pending",
    total: 476,
    date: "2026-05-27T13:20:00.000Z",
  },
  {
    id: "#14569",
    driver: "Noah Robinson",
    status: "pending",
    total: 325.5,
    date: "2026-05-28T09:10:00.000Z",
  },
  {
    id: "#14570",
    driver: "Ella Wood",
    status: "pending",
    total: 401.25,
    date: "2026-05-29T15:35:00.000Z",
  },
  {
    id: "#14571",
    driver: "Arthur Hall",
    status: "pending",
    total: 558,
    date: "2026-05-30T08:55:00.000Z",
  },
  {
    id: "#14572",
    driver: "Evie Green",
    status: "pending",
    total: 205.6,
    date: "2026-05-31T12:15:00.000Z",
  },
  {
    id: "#14573",
    driver: "Henry Baker",
    status: "pending",
    total: 495.75,
    date: "2026-06-01T14:40:00.000Z",
  },
  {
    id: "#14574",
    driver: "Poppy Adams",
    status: "pending",
    total: 276,
    date: "2026-06-02T10:25:00.000Z",
  },
  {
    id: "#14575",
    driver: "Archie Nelson",
    status: "pending",
    total: 367.4,
    date: "2026-06-03T16:30:00.000Z",
  },
  {
    id: "#14576",
    driver: "Sophie Carter",
    status: "pending",
    total: 584.2,
    date: "2026-06-04T07:40:00.000Z",
  },
  {
    id: "#14577",
    driver: "Theo Mitchell",
    status: "pending",
    total: 214.85,
    date: "2026-06-05T11:25:00.000Z",
  },
  {
    id: "#14578",
    driver: "Daisy Turner",
    status: "pending",
    total: 520,
    date: "2026-06-06T13:45:00.000Z",
  },
  {
    id: "#14579",
    driver: "William Phillips",
    status: "pending",
    total: 309.95,
    date: "2026-06-07T09:20:00.000Z",
  },
];
