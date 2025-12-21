import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, Calendar, Stethoscope, FileText, ClipboardList } from "lucide-react";

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
      <div className="space-y-8 animate-fade-in relative px-1">
        {/* Adorno sutil de fundo para a área administrativa */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Painel Executivo</h1>
            <p className="text-muted-foreground mt-1.5 font-medium">
              Bem-vindo ao HealthFlow, acompanhe seus indicadores em tempo real.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Sistema Operacional
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={stat.title} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass rounded-[2rem] p-8 shadow-xl border-white/40">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximas Consultas
            </h2>
            <div className="space-y-4">
              {[
                { patient: "Maria Silva", time: "09:00", doctor: "Dr. Carlos", type: "Cardiologia" },
                { patient: "João Santos", time: "10:30", doctor: "Dra. Ana", type: "Dermatologia" },
                { patient: "Pedro Oliveira", time: "14:00", doctor: "Dr. Carlos", type: "Retorno" },
              ].map((appointment, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 bg-white/40 hover:bg-white/60 rounded-2xl border border-white/20 transition-all duration-300 group cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                       {appointment.patient[0]}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        {appointment.patient}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {appointment.doctor} • <span className="text-primary/70">{appointment.type}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-black shadow-lg shadow-primary/20">
                    {appointment.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[2rem] p-8 shadow-xl border-white/40">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Atividades Recentes
            </h2>
            <div className="space-y-1">
              {[
                { action: "Novo paciente cadastrado", time: "Há 5 min", user: "Admin" },
                { action: "Consulta confirmada", time: "Há 15 min", user: "Dr. Carlos" },
                { action: "Prontuário atualizado", time: "Há 1 hora", user: "Dra. Ana" },
                { action: "Novo médico cadastrado", time: "Há 2 horas", user: "Root" },
              ].map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 hover:bg-primary/5 rounded-xl transition-all duration-200 group"
                >
                  <div>
                    <p className="text-foreground font-semibold group-hover:text-primary transition-colors">{activity.action}</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Por {activity.user}</p>
                  </div>
                  <span className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full font-medium">
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
