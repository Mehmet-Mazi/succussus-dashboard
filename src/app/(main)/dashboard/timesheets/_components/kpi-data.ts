export type KpiValueFormat = "number" | "currency" | "percentage" | "time" | "distance" | "custom";
export type KpiComparisonFormat = "number" | "percentage";

export interface TimesheetKpi {
  id: string;
  label: string;
  value: number;
  valueFormat: KpiValueFormat;
  comparison: number;
  comparisonFormat: KpiComparisonFormat;
  previousValue: number;
  previousValueFormat: KpiValueFormat;
  previousLabel: string;
}

export const timesheetKpis: TimesheetKpi[] = [
  {
    id: "01",
    label: "Current Months Total Earnings",
    value: 367075,
    valueFormat: "currency",
    comparison: 12,
    comparisonFormat: "percentage",
    previousValue: 334200,
    previousValueFormat: "currency",
    previousLabel: "average p/m",
  },
  {
    id: "02",
    label: "Total Stops Completed Last Week",
    value: 35102,
    valueFormat: "number",
    comparison: -2.5,
    comparisonFormat: "percentage",
    previousValue: 35120,
    previousValueFormat: "number",
    previousLabel: "last month",
  },
  {
    id: "03",
    label: "Contracts",
    value: 42,
    valueFormat: "number",
    comparison: 7,
    comparisonFormat: "percentage",
    previousValue: 35,
    previousValueFormat: "number",
    previousLabel: "last month",
  },
  {
    id: "04",
    label: "Title",
    value: 18.1,
    valueFormat: "percentage",
    comparison: 1.6,
    comparisonFormat: "percentage",
    previousValue: 16.5,
    previousValueFormat: "percentage",
    previousLabel: "last month",
  },
];