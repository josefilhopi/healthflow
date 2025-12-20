import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, Calendar, Stethoscope, FileText } from "lucide-react";

const stats = [
  {
    title: "Total de Pacientes",
    value: 1248,
    icon: Users,
    iconColor: "text-primary",
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Consultas Agendadas",
    value: 86,
    icon: Calendar,
    iconColor: "text-success",
    trend: { value: 8, isPositive: true },
  },
  {
    title: "Médicos Ativos",
    value: 24,
    icon: Stethoscope,
    iconColor: "text-purple-500",
  },
  {
    title: "Planos Cadastrados",
    value: 15,
    icon: FileText,
    iconColor: "text-warning",
  },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do sistema de gestão de saúde
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Próximas Consultas
            </h2>
            <div className="space-y-4">
              {[
                { patient: "Maria Silva", time: "09:00", doctor: "Dr. Carlos" },
                { patient: "João Santos", time: "10:30", doctor: "Dra. Ana" },
                { patient: "Pedro Oliveira", time: "14:00", doctor: "Dr. Carlos" },
              ].map((appointment, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-card-foreground">
                      {appointment.patient}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.doctor}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {appointment.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-card">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">
              Atividades Recentes
            </h2>
            <div className="space-y-4">
              {[
                { action: "Novo paciente cadastrado", time: "Há 5 min" },
                { action: "Consulta confirmada", time: "Há 15 min" },
                { action: "Prontuário atualizado", time: "Há 1 hora" },
                { action: "Novo médico cadastrado", time: "Há 2 horas" },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border-b border-border last:border-0"
                >
                  <p className="text-card-foreground">{activity.action}</p>
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
