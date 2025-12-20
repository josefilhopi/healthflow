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
    <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-card-foreground mt-2">{value}</p>
          {trend && (
            <p className={cn(
              "text-sm mt-2",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}% vs mês anterior
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg bg-secondary", iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
