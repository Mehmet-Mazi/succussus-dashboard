import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { timesheetKpis, type KpiValueFormat } from "./kpi-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
function formatValue(value: number, format: KpiValueFormat) {
  if (format === "currency") {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (format === "percentage") {
    return `${value}%`;
  }

  return new Intl.NumberFormat("en-GB").format(value);
}

function formatComparison(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}%`;
}
// const summaryCards = [
//   {
//     label: "Current Months Total Earnings",
//     value: "£367,075",
//     comparison: "+12%",
//     previousValue: "£334,200",
//     previousLabel: "average p/m",
//   },
//   {
//     label: "Total Stops Completed Last Week",
//     value: "35,102",
//     comparison: "-2.5%",
//     previousValue: "35,120",
//     previousLabel: "last month",
//   },
//   {
//     label: "Contracts",
//     value: "42",
//     comparison: "+7",
//     previousValue: "35",
//     previousLabel: "last month",
//   },
//   {
//     label: "Title",
//     value: "18.1%",
//     comparison: "+1.6%",
//     previousValue: "16.5%",
//     previousLabel: "last month",
//   },
// ] as const;

export function TimesheetKpiCards() {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-3xl tracking-tight">Timesheets Overview</h2>
        <p className="text-muted-foreground text-sm">
          Metrics of past performances.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* {summaryCards.map((card) => { */}
        {timesheetKpis.map((card) => {
        const isIncrease = card.comparison >= 0;

        return (
          <Card key={card.label}>
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardAction>
                <ArrowUpRight className="size-4" />
              </CardAction>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none tracking-tight">{formatValue(card.value, card.valueFormat)}</span>

                <Badge
                    variant="outline"
                    className={
                        isIncrease
                        ? "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
                        : "border-destructive/20 bg-destructive/10 text-destructive"
                    }
                    >
                    {isIncrease ? <TrendingUp /> : <TrendingDown />}
                    {formatComparison(card.comparison)}
                </Badge>
              </div>

              <p className="text-sm">
                <span className="font-medium text-foreground">{formatValue(card.previousValue, card.previousValueFormat)}</span>{" "}
                <span className="text-muted-foreground">{card.previousLabel}</span>
              </p>
            </CardContent>
          </Card>
        );
    })}
      </div>
    </section>
  );
}