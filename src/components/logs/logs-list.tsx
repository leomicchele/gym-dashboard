"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Log = {
  level: string;
  _id: string;
  message: string;
  action: string;
  createdAt: string;
  __v: number;
};

export default function LogsList() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 50;

  useEffect(() => {
    // Simulando carga de datos
    const timer = setTimeout(() => {
      // Datos mockeados - aquí añadiremos más logs para simular la necesidad de paginación
      const mockLogs: Log[] = [
        {
          level: "info",
          _id: "67fe7b79dcd50173ac425c07",
          message: "Se llamó a getAllProfesores",
          action: "Get All Profesores",
          createdAt: "2024-04-15T15:30:01.455Z",
          __v: 0
        },
        {
          level: "info",
          _id: "67fe7b79dcd50173ac425c16",
          message: "Se llamó a getAllProfesores",
          action: "Get All Profesores",
          createdAt: "2024-04-15T15:30:01.670Z",
          __v: 0
        },
        {
          level: "error",
          _id: "67fe80db4e421f9760a3a4fa",
          message: "Error al acceder a la base de datos",
          action: "Get Rutina",
          createdAt: "2024-04-15T15:52:59.042Z",
          __v: 0
        },
        {
          level: "warning",
          _id: "67fe80db4e421f9760a3a4fb",
          message: "Intento de acceso no autorizado",
          action: "Login Attempt",
          createdAt: "2024-04-15T16:22:10.042Z",
          __v: 0
        },
        {
          level: "info",
          _id: "67fe80db4e421f9760a3a4fc",
          message: "Usuario creado correctamente",
          action: "Create User",
          createdAt: "2024-04-15T16:45:20.042Z",
          __v: 0
        }
      ];
      
      // Generar más logs para simular una lista grande que necesita paginación
      const extraLogs: Log[] = [];
      for (let i = 0; i < 100; i++) {
        extraLogs.push({
          level: ["info", "warning", "error"][Math.floor(Math.random() * 3)],
          _id: `extra-log-${i}`,
          message: `Log generado automáticamente #${i}`,
          action: `Acción Simulada ${i}`,
          createdAt: new Date(2024, 3, Math.floor(Math.random() * 30) + 1).toISOString(),
          __v: 0
        });
      }
      
      setLogs([...mockLogs, ...extraLogs]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Ordenar logs por fecha (los más recientes primero)
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case "error":
        return "destructive";
      case "warning":
        return "outline";
      case "info":
      default:
        return "secondary";
    }
  };

  // Cálculos para la paginación
  const totalPages = Math.ceil(sortedLogs.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);

  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Función para generar botones de paginación
  const generarBotonesPaginacion = () => {
    const botones = [];
    
    // Botón para página anterior
    botones.push(
      <Button 
        key="anterior" 
        variant="outline" 
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>
    );
    
    // Números de página centrales
    if (totalPages <= 7) {
      // Si hay pocos páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        botones.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
            className="mx-1"
          >
            {i}
          </Button>
        );
      }
    } else {
      // Si hay muchas páginas, mostrar un conjunto limitado
      // Siempre mostrar la primera página
      botones.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className="mx-1"
        >
          1
        </Button>
      );
      
      // Lógica para mostrar '...' o números
      if (currentPage > 3) {
        botones.push(
          <Button
            key="ellipsis1"
            variant="outline"
            size="sm"
            disabled
            className="mx-1"
          >
            ...
          </Button>
        );
      }
      
      // Páginas alrededor de la página actual
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        botones.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(i)}
            className="mx-1"
          >
            {i}
          </Button>
        );
      }
      
      // Segundo ellipsis
      if (currentPage < totalPages - 2) {
        botones.push(
          <Button
            key="ellipsis2"
            variant="outline"
            size="sm"
            disabled
            className="mx-1"
          >
            ...
          </Button>
        );
      }
      
      // Siempre mostrar la última página
      if (totalPages > 1) {
        botones.push(
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            className="mx-1"
          >
            {totalPages}
          </Button>
        );
      }
    }
    
    // Botón para página siguiente
    botones.push(
      <Button
        key="siguiente"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="flex items-center gap-1"
      >
        Siguiente
        <ChevronRight className="h-4 w-4" />
      </Button>
    );
    
    return botones;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nivel</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Cargando logs...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  No hay logs disponibles
                </TableCell>
              </TableRow>
            ) : (
              currentLogs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>
                    <Badge variant={getBadgeVariant(log.level)}>
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    {format(new Date(log.createdAt), "HH:mm:ss - MMM dd", {
                      locale: es
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && logs.length > 0 && totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {generarBotonesPaginacion()}
        </div>
      )}
      
      {!loading && logs.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Mostrando {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, logs.length)} de {logs.length} logs
        </div>
      )}
    </div>
  );
} 