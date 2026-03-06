"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#ea580c",
  "#7c3aed",
  "#db2777",
]

const ChartContext = React.createContext(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          className={cn(
            "flex aspect-video justify-center text-xs",
            "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-axis_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-default-tooltip]:border-border [&_.recharts-default-tooltip]:bg-background [&_.recharts-default-tooltip]:text-foreground [&_.recharts-default-tooltip]:shadow-md [&_.recharts-tooltip-wrapper]:outline-none",
            className
          )}
          {...props}
        >
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartStyle = ({ id, config }) => {
  const colorConfig = config

  const colors = Object.entries(colorConfig).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: typeof value === "string" ? value : value.color,
    }
  }, {})

  return (
    <style>
      {`
        :root {
          ${Object.entries(colors)
            .map(
              ([key, color]) =>
                `--color-${key}: ${color};`
            )
            .join("")}
        }
      `}
    </style>
  )
}

const ChartTooltip = React.forwardRef(({ active, payload, label, nameKey }, ref) => {
  const { config } = useChart()

  if (active && payload && payload.length) {
    return (
      <div
        ref={ref}
        className="rounded-lg border border-border bg-background p-2 shadow-md"
      >
        <div className="grid grid-cols-2 gap-2">
          {payload.map((item, index) => {
            const key = item.dataKey
            const itemConfig = config[key]

            return (
              <div key={`${key}-${index}`} className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {itemConfig?.label || key}
                </span>
                <span className="font-bold text-foreground">
                  {item.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
})
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef(
  ({ active, payload, label, hideLabel }, ref) => {
    const { config } = useChart()

    if (active && payload && payload.length) {
      return (
        <div
          ref={ref}
          className="rounded-lg border border-border bg-background p-2 shadow-md"
        >
          {!hideLabel && label && (
            <div className="mb-2 font-semibold text-foreground">{label}</div>
          )}
          <div className="grid gap-2">
            {payload.map((item, index) => {
              const key = item.dataKey
              const itemConfig = config[key]

              return (
                <div key={`${key}-${index}`} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: item.color || itemConfig?.color,
                    }}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">
                      {itemConfig?.label || key}
                    </span>
                    <span className="font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return null
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent, useChart, COLORS }
