'use client'

import { useState, ReactNode } from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ExpandableTableRowProps {
  cells: ReactNode[]
  detailContent: ReactNode
  isExpanded?: boolean
  onToggle?: () => void
  id: string
}

export function ExpandableTableRow({
  cells,
  detailContent,
  isExpanded = false,
  onToggle,
  id
}: ExpandableTableRowProps) {
  const [internalExpanded, setInternalExpanded] = useState(isExpanded)
  
  const expanded = onToggle ? isExpanded : internalExpanded
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  return (
    <>
      <TableRow 
        className="cursor-pointer hover:bg-muted/50"
        onClick={handleToggle}
      >
        {cells.map((cell, index) => (
          <TableCell key={`${id}-cell-${index}`}>{cell}</TableCell>
        ))}
        <TableCell>
          {expanded ? 
            <ChevronUp className="h-4 w-4" /> : 
            <ChevronDown className="h-4 w-4" />
          }
        </TableCell>
      </TableRow>
      
      {expanded && (
        <TableRow key={`details-${id}`}>
          <TableCell colSpan={cells.length + 1} className="bg-muted/30 p-4">
            {detailContent}
          </TableCell>
        </TableRow>
      )}
    </>
  )
} 