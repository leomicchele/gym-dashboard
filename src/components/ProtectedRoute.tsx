"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/lib/storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = getLocalStorage();
        // Verificar si el usuario está autenticado (puedes ajustar esta lógica según tus necesidades)
        const isUserAuthenticated = authData && Object.keys(authData).length > 0;
        
        if (!isUserAuthenticated) {
          router.push("/auth");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    // Puedes mostrar un spinner o un mensaje de carga aquí
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          <p className="mt-2">Cargando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
} 