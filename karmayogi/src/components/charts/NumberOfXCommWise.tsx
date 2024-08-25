"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Sample chartConfig
const chartConfig = {
  whatsapp: {
    label: "Whatsapp",
    color: "hsl(var(--chart-1))",
  },
  sms: {
    label: "SMS",
    color: "hsl(var(--chart-2))",
  },
  email: {
    label: "Email",
    color: "hsl(var(--chart-3))",
  }
} satisfies ChartConfig

interface NumberOfXCommWiseProps {
  X: string;
  data: {
    email: number;
    sms: number;
    whatsapp: number;
  };
}

export function NumberOfXCommWise({ X, data }: NumberOfXCommWiseProps) {
  // Convert the data object into a format suitable for the Pie chart
  const chartData = [
    { channel: "Whatsapp", count: data.whatsapp, fill: chartConfig.whatsapp.color },
    { channel: "SMS", count: data.sms, fill: chartConfig.sms.color },
    { channel: "Email", count: data.email, fill: chartConfig.email.color },
  ]

  const total = chartData.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <Card className="flex flex-col max-w-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle>No of {X} - Communication wise</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="channel"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {X}
                        </tspan>
                      </text>
                    )
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground text-center">
          Showing total {X} for the campaign in different communication channels.
        </div>
      </CardFooter>
    </Card>
  )
}
