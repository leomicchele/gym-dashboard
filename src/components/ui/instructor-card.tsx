'use client'

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface InstructorCardProps {
  instructor: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    gimnasioName: string;
    estado: boolean;
    dni?: string;
    limiteAlumnos?: number;
    fechaCreacion?: string;
  }
  onClick?: () => void;
}

export function InstructorCard({ instructor, onClick }: InstructorCardProps) {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {instructor.nombre?.charAt(0) || ''}{instructor.apellido?.charAt(0) || ''}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {instructor.nombre} {instructor.apellido}
            </CardTitle>
            <Badge variant={instructor.estado ? "default" : "secondary"}>
              {instructor.estado ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Email:</span> {instructor.email}</p>
          <p><span className="font-medium">Gimnasio:</span> {instructor.gimnasioName}</p>
          {/* Campos opcionales que pueden mostrarse según necesidad */}
          {/* {instructor.dni && (
            <p><span className="font-medium">DNI:</span> {instructor.dni}</p>
          )} */}
          {/* {instructor.limiteAlumnos && (
            <p><span className="font-medium">Límite de alumnos:</span> {instructor.limiteAlumnos}</p>
          )} */}
        </div>
      </CardContent>
    </Card>
  )
} 