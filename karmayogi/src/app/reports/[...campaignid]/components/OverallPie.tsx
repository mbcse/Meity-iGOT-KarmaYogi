"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../../components/ui/chart";

const chartConfig = {
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-1))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-3))",
  },
  unsubscribed: {
    label: "Unsubscribed",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const transformData = (data:any) => [
  {
    name: "Delivered",
    value: data.stats.delivered,
    fill: "var(--color-delivered)",
  },
  { name: "Failed", value: data.stats.failed, fill: "var(--color-failed)" },
  {
    name: "Pending",
    value: data.stats.pending,
    fill: "var(--color-pending)",
  },
  {
    name: "Unsubscribed",
    value: data.stats.unsubscribed,
    fill: "var(--color-unsubscribed)",
  },
];

export default function OverallPie({ data }:{
    data:any
}) {
  const chartData = transformData(data);

return (
    <Card className="flex flex-col min-w-[400px] w-full">
        <CardHeader className="items-center pb-0">
            <CardTitle>Radial Chart - Grid</CardTitle>
            <CardDescription>Statistics for "20% off" campaign</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
            >
                <RadialBarChart data={chartData} innerRadius={30} outerRadius={100}>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel nameKey="name" />}
                    />
                    <PolarGrid gridType="circle" />
                    <RadialBar dataKey="value" />
                </RadialBarChart>
            </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
            {Object.entries(chartConfig).map(([key, value]) => (
                <div key={key} className="flex items-center">
                    <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: value.color }}
                    ></div>
                    <span>
                        {value.label}:{" "}
                        {chartData.find((item) => item.name === value.label)?.value}
                    </span>
                </div>
            ))}
        </CardFooter>
    </Card>
);
}
