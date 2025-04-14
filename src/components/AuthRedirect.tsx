"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/lib/storage";

interface AuthRedirectProps {
  children: React.ReactNode;
}

export default function AuthRedirect({ children }: AuthRedirectProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = getLocalStorage();
        // Verificar si el usuario está autenticado
        const isUserAuthenticated = authData && Object.keys(authData).length > 0;
        
        if (isUserAuthenticated) {
          // Si está autenticado, redirigir al dashboard
          router.push("/dashboard");
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    // Mostrar indicador de carga mientras se verifica la autenticación
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          <p className="mt-2">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar la página de autenticación
  return !isAuthenticated ? <>{children}</> : null;
} 