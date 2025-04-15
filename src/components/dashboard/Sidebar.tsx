"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building, Users, CreditCard, Dumbbell, LogOut, Menu, X, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { removeLocalStorage } from "@/lib/storage";
import { useState, useEffect } from "react";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem = ({ href, icon, label }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-primary/10",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export function Sidebar() {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar al inicio
    checkMobile();
    
    // Configurar listener para cambios de tamaño
    window.addEventListener('resize', checkMobile);
    
    // Limpiar listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleLogout = () => {
    removeLocalStorage();
    router.push('/');
  };

  return (
    <>
      {/* Botón de menú móvil */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background shadow-md"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      
      <div className={cn(
        "fixed md:relative h-full w-64 flex-col border-r bg-background p-4 z-40 transition-all duration-300 ease-in-out",
        isMobile ? (isMobileOpen ? "flex translate-x-0" : "flex -translate-x-full") : "flex"
      )}>
        <div className="mb-6 flex items-center gap-2 px-2">
          <Dumbbell className="h-6 w-6" />
          <h1 className="text-xl font-bold">Gym Dashboard</h1>
        </div>
        
        <div className="space-y-1">
          <SidebarItem 
            href="/dashboard" 
            icon={<Building className="h-5 w-5" />} 
            label="Gimnasio" 
          />
          <SidebarItem 
            href="/dashboard/instructores" 
            icon={<Users className="h-5 w-5" />} 
            label="Profesores" 
          />
          <SidebarItem 
            href="/dashboard/pagos" 
            icon={<CreditCard className="h-5 w-5" />} 
            label="Pagos" 
          />
          <SidebarItem 
            href="/dashboard/logs" 
            icon={<ClipboardList className="h-5 w-5" />} 
            label="Logs" 
          />
        </div>
        
        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-all hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
      
      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
} 