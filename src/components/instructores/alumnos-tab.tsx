'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExpandableTableRow } from '@/components/ui/expandable-table-row'
import { SearchBar } from '@/components/ui/searchbar'

interface AlumnosTabProps {
  alumnos: any[]
  alumnosLoading: boolean
  instructores: any[]
  instructorActual: any
}

export function AlumnosTab({ alumnos, alumnosLoading, instructores, instructorActual }: AlumnosTabProps) {
  const [busqueda, setBusqueda] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedAlumno, setExpandedAlumno] = useState<string | null>(null)
  const [selectedProfesores, setSelectedProfesores] = useState<Record<string, string>>({})
  const alumnosPorPagina = 10

  // Filtrar alumnos por nombre o apellido
  const alumnosFiltrados = alumnos.filter(alumno => {
    const terminoBusqueda = busqueda.toLowerCase()
    return (
      (alumno?.nombre?.toLowerCase() || '').includes(terminoBusqueda) ||
      (alumno?.apellido?.toLowerCase() || '').includes(terminoBusqueda)
    )
  })
  
  // Ordenar alumnos por fecha de creación (más reciente primero)
  const alumnosOrdenados = [...alumnosFiltrados].sort((a, b) => {
    // Convertir las fechas a objetos Date para comparación
    const fechaA = a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0
    const fechaB = b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0
    return fechaB - fechaA // Orden descendente (más reciente primero)
  })
  
  // Calcular alumnos para la página actual
  const indexOfLastAlumno = currentPage * alumnosPorPagina
  const indexOfFirstAlumno = indexOfLastAlumno - alumnosPorPagina
  
  const alumnosActuales = alumnosOrdenados.slice(indexOfFirstAlumno, indexOfLastAlumno)
  const totalPaginas = Math.ceil(alumnosOrdenados.length / alumnosPorPagina)

  const toggleAlumnoDetails = (alumnoId: string) => {
    if (expandedAlumno === alumnoId) {
      setExpandedAlumno(null)
    } else {
      setExpandedAlumno(alumnoId)
    }
  }

  const handleProfesorSelect = (alumnoId: string, profesorId: string) => {
    setSelectedProfesores(prev => ({
      ...prev,
      [alumnoId]: profesorId
    }))
  }

  // Cambiar de página
  const cambiarPagina = (numeroPagina: number) => {
    setCurrentPage(numeroPagina)
  }

  // Función para generar botones de paginación
  const generarBotonesPaginacion = () => {
    const botones = []
    
    // Botón para página anterior
    botones.push(
      <Button 
        key="anterior" 
        variant="outline" 
        size="sm"
        onClick={() => cambiarPagina(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>
    )
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
      botones.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => cambiarPagina(i)}
          className="mx-1"
        >
          {i}
        </Button>
      )
    }
    
    // Botón para página siguiente
    botones.push(
      <Button
        key="siguiente"
        variant="outline"
        size="sm"
        onClick={() => cambiarPagina(currentPage + 1)}
        disabled={currentPage === totalPaginas || totalPaginas === 0}
      >
        Siguiente
      </Button>
    )
    
    return botones
  }

  // Reset a la primera página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1)
  }, [busqueda])

  return (
    <div className="space-y-4">
      {alumnosLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <SearchBar
            placeholder="Buscar por nombre o apellido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Creación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumnosOrdenados.length > 0 ? (
                  alumnosActuales.map((alumno) => {
                    const cells = [
                      alumno.nombre,
                      alumno.apellido,
                      alumno.dni,
                      alumno.fechaCreacion 
                        ? new Date(alumno.fechaCreacion).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })
                        : 'No especificada',
                      <Badge key={`badge-${alumno._id}`} variant={alumno.estado ? "default" : "secondary"}>
                        {alumno.estado ? 'Activo' : 'Inactivo'}
                      </Badge>
                    ]
                    
                    const detailContent = (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col p-2 border rounded-md">
                          <p className="text-xs text-muted-foreground">ID</p>
                          <p className="text-sm font-medium truncate">{alumno._id}</p>
                        </div>
                        <div className="flex flex-col p-2 border rounded-md">
                          <p className="text-xs text-muted-foreground">Fecha Nacimiento</p>
                          <p className="text-sm font-medium">{alumno.edad || 'No especificada'}</p>
                        </div>
                        <div className="flex flex-col p-2 border rounded-md">
                          <p className="text-xs text-muted-foreground">Gimnasio</p>
                          <p className="text-sm font-medium">{alumno.gimnasio || 'No especificado'}</p>
                        </div>
                        <div className="flex flex-col p-2 border rounded-md">
                          <p className="text-xs text-muted-foreground">ID de Pagos</p>
                          <p className="text-sm font-medium truncate">{alumno.pagosId || 'No especificado'}</p>
                        </div>
                        <div className="flex flex-col p-2 border rounded-md md:col-span-2">
                          <p className="text-xs text-muted-foreground">Trasladar a</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Select 
                              value={selectedProfesores[alumno._id] || ""} 
                              onValueChange={(value) => handleProfesorSelect(alumno._id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar profesor" />
                              </SelectTrigger>
                              <SelectContent>
                                {instructores
                                  .filter(instructor => instructor._id !== instructorActual._id)
                                  .map((instructor) => (
                                    <SelectItem key={instructor._id} value={instructor._id}>
                                      {instructor.nombre} {instructor.apellido}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              size="sm" 
                              disabled={!selectedProfesores[alumno._id]}
                              onClick={(e) => {
                                e.stopPropagation()
                                // Lógica para trasladar al alumno
                                alert(`Trasladar alumno ${alumno.nombre} al profesor seleccionado`)
                                // Limpiar la selección después de trasladar
                                setSelectedProfesores(prev => {
                                  const newState = {...prev}
                                  delete newState[alumno._id]
                                  return newState
                                })
                              }}
                            >
                              Aceptar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                    
                    return (
                      <ExpandableTableRow
                        key={alumno._id}
                        id={alumno._id}
                        cells={cells}
                        detailContent={detailContent}
                        isExpanded={expandedAlumno === alumno._id}
                        onToggle={() => toggleAlumnoDetails(alumno._id)}
                      />
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      {busqueda 
                        ? 'No se encontraron alumnos con esa búsqueda' 
                        : 'Este instructor no tiene alumnos asignados'
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {alumnosOrdenados.length > 0 && (
            <div className="flex justify-center gap-2 pt-2">
              {generarBotonesPaginacion()}
            </div>
          )}
          
          {alumnosOrdenados.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Mostrando {indexOfFirstAlumno + 1}-{Math.min(indexOfLastAlumno, alumnosOrdenados.length)} de {alumnosOrdenados.length} alumnos
            </div>
          )}
        </>
      )}
    </div>
  )
} 