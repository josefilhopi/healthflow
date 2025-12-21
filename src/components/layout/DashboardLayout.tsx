import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  FileText, 
  Calendar,
  Menu,
  X,
  LogOut,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth"; // Importar useAuth

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Pacientes", href: "/pacientes" },
  { icon: Stethoscope, label: "Médicos", href: "/medicos" },
  { icon: FileText, label: "Planos de Saúde", href: "/planos-saude" },
  { icon: ClipboardList, label: "Procedimentos", href: "/procedimentos" },
  { icon: Calendar, label: "Agendamentos", href: "/agendamentos" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); // Usar o hook de autenticação

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isLoggedIn && location.pathname !== "/login") {
    return null; // Não renderiza o layout se não estiver logado e não estiver na página de login
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 glass border-r border-border/50 transform transition-transform duration-300 ease-in-out lg:transform-none shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-8 border-b border-border/50">
            <Link to="/" className="text-2xl font-black tracking-tight text-gradient">
              HealthFlow
            </Link>
            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-bold scale-[1.02]"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary font-medium"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-6 border-t border-border/50">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all duration-300 w-full text-left font-semibold group"
            >
              <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Sair do Painel</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between h-16 px-6 glass border-b border-border/50 sticky top-0 z-30">
          <button
            className="p-2 text-muted-foreground hover:text-primary transition-colors bg-white/50 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-xl font-bold text-gradient">HealthFlow</span>
          <div className="w-10" />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}