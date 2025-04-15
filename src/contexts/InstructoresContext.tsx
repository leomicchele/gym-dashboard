'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLocalStorage } from '@/lib/storage';

interface Alumno {
  _id: string;
  nombre: string;
  apellido: string;
  edad: string;
  dni: string;
  experiencia: string;
  peso: string;
  altura: string;
  objetivo: string;
  estado: boolean;
  diasSemanales: string;
  caducacionRutina?: string;
  fechaCreacion: string;
  pagosId?: string;
  gimnasio?: string;
}

interface Instructor {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  estado: boolean;
  limiteAlumnos: number;
  fechaCreacion: string;
  gimnasio: string;
  gimnasioName: string;
}

interface InstructoresContextType {
  instructores: Instructor[];
  selectedInstructor: Instructor | null;
  alumnos: Alumno[];
  loading: boolean;
  alumnosLoading: boolean;
  error: string | null;
  fetchInstructores: () => Promise<void>;
  fetchAlumnosInstructor: (instructorId: string) => Promise<void>;
  setSelectedInstructor: (instructor: Instructor | null) => void;
}

const InstructoresContext = createContext<InstructoresContextType | undefined>(undefined);

export function InstructoresProvider({ children }: { children: ReactNode }) {
  const [instructores, setInstructores] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [alumnosLoading, setAlumnosLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructores = async () => {
    setLoading(true);
    try {
      const authToken = getLocalStorage();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profesores/all-profesores`, {
        headers: {
          'x-token': authToken.token || ''
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los instructores');
      }

      const data = await response.json();
      console.log(data);
      setInstructores(data.profesores || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumnosInstructor = async (instructorId: string) => {
    setAlumnosLoading(true);
    try {
      const authToken = getLocalStorage();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profesores/all-profesores/${instructorId}`, {
        headers: {
          'x-token': authToken.token || ''
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los alumnos del instructor');
      }

      const data = await response.json();
      setAlumnos(data.alumnos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error al obtener alumnos:', err);
    } finally {
      setAlumnosLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructores();
  }, []);

  return (
    <InstructoresContext.Provider
      value={{
        instructores,
        selectedInstructor,
        alumnos,
        loading,
        alumnosLoading,
        error,
        fetchInstructores,
        fetchAlumnosInstructor,
        setSelectedInstructor
      }}
    >
      {children}
    </InstructoresContext.Provider>
  );
}

export function useInstructores() {
  const context = useContext(InstructoresContext);
  
  if (context === undefined) {
    throw new Error('useInstructores debe ser usado dentro de un InstructoresProvider');
  }
  
  return context;
} 