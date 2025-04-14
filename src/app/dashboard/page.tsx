import { Dumbbell, Users, CreditCard } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-center md:text-left">Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración del gimnasio
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Miembros Activos"
          value="124"
          icon={<Users className="h-5 w-5" />}
          description="Total de miembros registrados en este mes"
        />
        <StatsCard
          title="Instructores"
          value="8"
          icon={<Dumbbell className="h-5 w-5" />}
          description="Profesionales disponibles para clases"
        />
        <StatsCard
          title="Ingresos Mensuales"
          value="$5,240"
          icon={<CreditCard className="h-5 w-5" />}
          description="Ingresos del mes actual"
        />
      </div>
    </div>
  );
} 