'use client'

import { ReactNode } from "react"

interface DetailItemProps {
  label: string
  value: ReactNode
  colSpan?: number
}

export function DetailItem({ label, value, colSpan = 1 }: DetailItemProps) {
  return (
    <div className={`flex flex-col items-center p-2 border rounded-md ${colSpan > 1 ? `md:col-span-${colSpan}` : ''}`}>
      <p className="font-medium text-muted-foreground text-sm">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}

interface DetailGridProps {
  items: DetailItemProps[]
  className?: string
}

export function DetailGrid({ items, className = "" }: DetailGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4 ${className}`}>
      {items.map((item, index) => (
        <DetailItem
          key={index}
          label={item.label}
          value={item.value}
          colSpan={item.colSpan}
        />
      ))}
    </div>
  )
} 