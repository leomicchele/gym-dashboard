import { Metadata } from "next";
import LogsList from "@/components/logs/logs-list";

export const metadata: Metadata = {
  title: "Logs",
  description: "Lista de logs del sistema",
};

export default function LogsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
          <p className="text-muted-foreground">
            Registro de actividades del sistema
          </p>
        </div>
      </div>
      <LogsList />
    </div>
  );
} 