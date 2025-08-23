"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive area chart"

const chartData = [
  {
    date: '2025-08-23',
    enrollments: 12,
  },
  {
    date: '2025-08-22',
    enrollments: 10,
  },
  {
    date: '2025-08-21',
    enrollments: 20,
  },
  {
    date: '2025-08-20',
    enrollments: 5,
  },
  {
    date: '2025-08-10',
    enrollments: 9,
  },
  {
    date: '2025-08-19',
    enrollments: 22,
  },
  {
    date: '2025-08-15',
    enrollments: 3,
  },
  {
    date: '2025-08-18',
    enrollments: 1,
  }
]

const chartConfig = {
  enrollments: {
    label: 'Enrollments',
    color: 'var(--chart-1)',
  }
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  data: { date: string, enrollments: number }[]
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {

  const totalEnrollmentsNumber = React.useMemo(
    () => data.reduce((acc, curr) => acc+curr.enrollments,0), [data]
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          Total Enrollments
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Total enrollment for last 30 days: {totalEnrollmentsNumber}</span>
          <span className="@[540px]/card:hidden">Last 30 days: {totalEnrollmentsNumber}</span>
        </CardDescription>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={'date'}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={'preserveStartEnd'}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />

              <ChartTooltip content={<ChartTooltipContent className="w-[150px]" label={(value: any) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }} />} />

              <Bar dataKey={'enrollments'} fill="var(--color-enrollments)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </CardHeader>
    </Card>
  )
}
