'use client'

import { useInstructores } from '@/contexts/InstructoresContext';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { InstructorCard } from '@/components/ui/instructor-card';
import { InstructorDetailDialog } from '@/components/instructores/instructor-detail-dialog';

export default function InstructoresPage() {
  const { 
    instructores, 
    selectedInstructor, 
    loading, 
    error, 
    setSelectedInstructor, 
    fetchAlumnosInstructor, 
    alumnos, 
    alumnosLoading 
  } = useInstructores();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busquedaProfesor, setBusquedaProfesor] = useState('');

  const handleProfesorClick = (profesor: any) => {
    setSelectedInstructor(profesor);
    setDialogOpen(true);
  };

  // Filtrar profesores por nombre o apellido
  const profesoresFiltrados = instructores.filter(profesor => {
    const terminoBusqueda = busquedaProfesor.toLowerCase();
    return (
      (profesor?.nombre?.toLowerCase() || '').includes(terminoBusqueda) ||
      (profesor?.apellido?.toLowerCase() || '').includes(terminoBusqueda)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-center md:text-left">Profesores</h2>
        <p className="text-muted-foreground">
          Gestiona el personal de instructores del gimnasio
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive p-6 text-destructive">
          {error}
        </div>
      ) : (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar profesor por nombre o apellido..."
              value={busquedaProfesor}
              onChange={(e) => setBusquedaProfesor(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profesoresFiltrados.length > 0 ? (
              profesoresFiltrados.map((profesor) => (
                <InstructorCard 
                  key={profesor._id} 
                  instructor={profesor}
                  onClick={() => handleProfesorClick(profesor)}
                />
              ))
            ) : (
              <div className="col-span-full rounded-lg border p-6 text-center">
                {instructores.length === 0 
                  ? 'No hay profesores disponibles.' 
                  : `No se encontraron profesores que coincidan con "${busquedaProfesor}".`
                }
              </div>
            )}
          </div>
        </>
      )}

      <InstructorDetailDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        instructor={selectedInstructor}
        fetchAlumnosInstructor={fetchAlumnosInstructor}
        alumnos={alumnos}
        alumnosLoading={alumnosLoading}
        instructores={instructores}
      />
    </div>
  );
} 