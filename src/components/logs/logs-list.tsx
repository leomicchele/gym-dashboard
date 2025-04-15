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
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { fetchLogs, Log } from "@/lib/api/logs";

export default function LogsList() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 50;
  const [error, setError] = useState<string | null>(null);

  const getLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLogs();
      setLogs(data);
    } catch (err) {
      setError("Error al cargar los logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLogs();
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Registros del sistema</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={getLogs} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {loading ? "Cargando..." : "Recargar"}
        </Button>
      </div>
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
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-red-500">
                  {error}
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
                    {format(new Date(log.createdAt), "HH:mm:ss - MMM dd", {
                      locale: es
                    })}
                  </TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(log.level)}>
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && !error && logs.length > 0 && totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {generarBotonesPaginacion()}
        </div>
      )}
      
      {!loading && !error && logs.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Mostrando {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, logs.length)} de {logs.length} logs
        </div>
      )}
    </div>
  );
} 