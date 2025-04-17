'use client'

import { useState, ReactNode } from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
      
      <TableRow className="overflow-hidden p-0">
        <TableCell colSpan={cells.length + 1} className="p-0 border-0">
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key={`details-${id}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: "auto", 
                  opacity: 1, 
                  transition: { 
                    height: { duration: 0.3 }, 
                    opacity: { duration: 0.2, delay: 0.1 } 
                  }
                }}
                exit={{ 
                  height: 0, 
                  opacity: 0,
                  transition: { 
                    height: { duration: 0.3 }, 
                    opacity: { duration: 0.1 } 
                  }
                }}
                className="bg-muted/30 overflow-hidden"
              >
                <div className="p-4">
                  {detailContent}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TableCell>
      </TableRow>
    </>
  )
} 