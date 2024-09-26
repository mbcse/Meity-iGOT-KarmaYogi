"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

// Define the campaign data interface
export interface I_GlobalChart_EmailTitleComparision {
  campaignName: string;
  targeted: number;
  bounced: number;
  opened: number;
  mobile: number;
  desktop: number;
  linkConversion: number;
}



// Define the metric keys
const metrics: Array<keyof Omit< I_GlobalChart_EmailTitleComparision, 'campaignName'>> = [
  "targeted",
  "bounced",
  "opened",
  "mobile",
  "desktop",
  "linkConversion"
]

// Transform data to fit the chart
const transformData = (data:  I_GlobalChart_EmailTitleComparision[]) => {
  return metrics.map((metric) => {
    const entry: any = { metric }
    data.forEach((campaign) => {
      entry[campaign.campaignName] = campaign[metric]
    })
    return entry
  })
}

// Generate chart configuration dynamically
const chartConfig = (data:  I_GlobalChart_EmailTitleComparision[]): ChartConfig => {
  const config: ChartConfig = {}
  data.forEach((campaign, index) => {
    config[campaign.campaignName] = {
      label: campaign.campaignName,
      color: `hsl(${index * 30}, 70%, 50%)`, // Dynamic color
    }
  })
  return config
}

export function EmailTitleComparision({ data }: { data:  I_GlobalChart_EmailTitleComparision[] }) {
  const transformedData = transformData(data)
  const config = chartConfig(data)

  return (
    <Card className="min-w-[500px]">
      <CardHeader>
        <CardTitle>Email Campaign Metrics Comparison</CardTitle>
        <CardDescription>
          Side-by-side comparison of campaign metrics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            width={600}
            height={400}
            data={transformedData}
            layout="vertical" // Rotate the chart
            barCategoryGap="20%" // Adjust bar spacing
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="metric" type="category" />
            <Tooltip />
            <Legend />
            {data.map((campaign) => (
              <Bar
                key={campaign.campaignName}
                dataKey={campaign.campaignName}
                fill={config[campaign.campaignName]?.color || "#000"} // Fallback color
                radius={[0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
