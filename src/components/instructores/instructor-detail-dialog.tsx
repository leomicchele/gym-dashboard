'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogClose 
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DetailGrid } from '@/components/ui/detail-grid'
import { AlumnosTab } from './alumnos-tab'

interface InstructorType {
  _id: string
  nombre: string
  apellido: string
  email: string
  dni: string
  gimnasioName: string
  estado: boolean
  limiteAlumnos: number
  fechaCreacion: string
}

interface InstructorDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  instructor: InstructorType | null
  fetchAlumnosInstructor: (id: string) => void
  alumnos: any[]
  alumnosLoading: boolean
  instructores: any[]
}

export function InstructorDetailDialog({
  open,
  onOpenChange,
  instructor,
  fetchAlumnosInstructor,
  alumnos,
  alumnosLoading,
  instructores
}: InstructorDetailDialogProps) {
  const [activeTab, setActiveTab] = useState('datos')
  const alreadyFetchedRef = useRef<string | null>(null)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === 'alumnos' && instructor && alreadyFetchedRef.current !== instructor._id) {
      fetchAlumnosInstructor(instructor._id)
      alreadyFetchedRef.current = instructor._id
    }
  }

  useEffect(() => {
    // Limpia la referencia cuando se cierra el diálogo
    if (!open) {
      alreadyFetchedRef.current = null
    } else {
      // Restablece la pestaña a 'datos' cuando el diálogo se abre
      setActiveTab('datos')
    }
  }, [open])

  if (!instructor) return null

  // Preparamos los items para el DetailGrid
  const detailItems = [
    { label: 'Nombre', value: instructor.nombre },
    { label: 'Apellido', value: instructor.apellido },
    { label: 'Email', value: instructor.email },
    { label: 'DNI', value: instructor.dni },
    { 
      label: 'Gimnasio', 
      value: instructor.gimnasioName,
      colSpan: 2 
    },
    { 
      label: 'Límite de alumnos', 
      value: instructor.limiteAlumnos 
    },
    { 
      label: 'Fecha de creación', 
      value: new Date(instructor.fechaCreacion).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] w-[95%] mx-auto max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {instructor.nombre} {instructor.apellido}
          </DialogTitle>
          <DialogDescription>
            Detalles del instructor
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="datos">Datos</TabsTrigger>
            <TabsTrigger value="alumnos">Alumnos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="datos" className="mt-4">
            <div className="flex flex-col space-y-4 py-4">
              <div className="flex justify-center mb-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {instructor.nombre?.charAt(0) || ''}{instructor.apellido?.charAt(0) || ''}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant={instructor.estado ? "default" : "secondary"} className="mt-2">
                    {instructor.estado ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <p className="text-sm text-muted-foreground">ID: {instructor._id}</p>
                </div>
              </div>
              
              <DetailGrid items={detailItems} />
            </div>
          </TabsContent>
          
          <TabsContent value="alumnos" className="mt-4">
            <AlumnosTab 
              alumnos={alumnos}
              alumnosLoading={alumnosLoading}
              instructores={instructores}
              instructorActual={instructor}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
          <Button type="button" variant="default">
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 