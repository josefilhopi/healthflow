import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, iconColor = "text-primary", trend }: StatsCardProps) {
  return (
    <div className="glass rounded-[2rem] p-7 shadow-xl hover:shadow-2xl transition-all duration-500 animate-scale-in border-white/40 group relative overflow-hidden">
      {/* Detalhe vibrante no hover */}
      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{title}</p>
          <p className="text-4xl font-extrabold text-foreground mt-3 tracking-tighter">{value}</p>
          {trend && (
            <div className={cn(
              "text-sm mt-4 flex items-center gap-1.5 font-bold",
              trend.isPositive ? "text-emerald-500" : "text-rose-500"
            )}>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-current/10">
                {trend.isPositive ? "↑" : "↓"}
              </span>
              {trend.isPositive ? "+" : ""}{trend.value}% <span className="text-muted-foreground font-medium text-xs">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={cn("p-4 rounded-[1.25rem] bg-primary/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner", iconColor)}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}
