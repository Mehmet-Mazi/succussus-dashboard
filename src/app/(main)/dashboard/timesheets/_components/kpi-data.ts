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
    value: 0,
    valueFormat: "currency",
    comparison: 0,
    comparisonFormat: "percentage",
    previousValue: 0,
    previousValueFormat: "currency",
    previousLabel: "average p/m",
  },
  {
    id: "02",
    label: "Growth",
    value: 0,
    valueFormat: "percentage",
    comparison: 0,
    comparisonFormat: "percentage",
    previousValue: 0,
    previousValueFormat: "percentage",
    previousLabel: "last month",
  },
  {
    id: "03",
    label: "Total Stops Completed Last Week",
    value: 0,
    valueFormat: "number",
    comparison: 0,
    comparisonFormat: "percentage",
    previousValue: 0,
    previousValueFormat: "number",
    previousLabel: "last month",
  },
  {
    id: "04",
    label: "Invoice Sent",
    value: "1/10",
    valueFormat: "custom",
    comparison: 0,
    comparisonFormat: "percentage",
    previousValue: "",
    previousValueFormat: "custom",
    previousLabel: "",
  },
];
