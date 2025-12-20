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
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-in-out lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
            <Link to="/" className="text-xl font-bold text-primary">
              HealthManager
            </Link>
            <button
              className="lg:hidden p-2 text-sidebar-foreground hover:text-primary transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-sidebar-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-200 w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-card border-b border-border">
          <button
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-bold text-primary">HealthManager</span>
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