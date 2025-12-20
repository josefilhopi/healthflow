import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Medicos from "./pages/Medicos";
import Pacientes from "./pages/Pacientes";
import PlanosSaude from "./pages/PlanosSaude";
import Procedimentos from "./pages/Procedimentos";
import Agendamentos from "./pages/Agendamentos";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage"; // Importar a nova página de login
import { AuthProvider, useAuth } from "./hooks/use-auth"; // Importar AuthProvider e useAuth
import React from "react"; // Importar React para React.FC

const queryClient = new QueryClient();

// Componente para proteger rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} /> {/* Rota para a página de login */}
      
      {/* Rotas protegidas */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/medicos" element={<ProtectedRoute><Medicos /></ProtectedRoute>} />
      <Route path="/pacientes" element={<ProtectedRoute><Pacientes /></ProtectedRoute>} />
      <Route path="/planos-saude" element={<ProtectedRoute><PlanosSaude /></ProtectedRoute>} />
      <Route path="/procedimentos" element={<ProtectedRoute><Procedimentos /></ProtectedRoute>} />
      <Route path="/agendamentos" element={<ProtectedRoute><Agendamentos /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider> {/* Envolver a aplicação com AuthProvider */}
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;