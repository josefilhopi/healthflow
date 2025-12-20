import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Shield,
  BarChart3,
  Clock,
  CheckCircle2,
  Star,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { HeroCarousel } from "@/components/landing/HeroCarousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const features = [
  {
    icon: Users,
    title: "Gestão de Pacientes",
    description: "Cadastro completo com histórico médico e documentos.",
  },
  {
    icon: Calendar,
    title: "Agendamentos Inteligentes",
    description: "Organize consultas e procedimentos de forma eficiente.",
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Proteção total das informações dos seus pacientes.",
  },
  {
    icon: BarChart3,
    title: "Relatórios Detalhados",
    description: "Análises e métricas para tomada de decisões.",
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description: "Automatize tarefas repetitivas do dia a dia.",
  },
  {
    icon: CheckCircle2,
    title: "Fácil de Usar",
    description: "Interface intuitiva para toda a equipe.",
  },
];

const topDoctors = [
  {
    rank: 1,
    name: "Dra. Ana Carolina Silva",
    specialty: "Cardiologista",
    rating: 4.9,
    totalReviews: 234,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ana%20Carolina",
  },
  {
    rank: 2,
    name: "Dr. Ricardo Mendes",
    specialty: "Ortopedista",
    rating: 4.8,
    totalReviews: 189,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ricardo%20Mendes",
  },
  {
    rank: 3,
    name: "Dra. Juliana Santos",
    specialty: "Dermatologista",
    rating: 4.7,
    totalReviews: 156,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Juliana%20Santos",
  },
];

export default function Index() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight animate-fade-in">
              Gestão de saúde <span className="text-primary">inteligente</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
              Simplifique a administração da sua clínica ou consultório com nossa
              plataforma completa. Gerencie pacientes, médicos, agendamentos e
              muito mais em um só lugar.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                <Button variant="hero" size="xl">
                  Começar Gratuitamente
                </Button>
              </Link>
              <a href="#servicos">
                <Button variant="outline" size="xl">
                  Conhecer Recursos
                </Button>
              </a>
            </div>
          </div>

          {/* ✅ Ajuste do tamanho do HeroCarousel */}
          <div className="mt-12 animate-fade-in">
            <div className="mx-auto w-full max-w-6xl">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="servicos" className="py-16 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Tudo que você precisa
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas completas para uma gestão eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Doctors Section */}
      <section className="py-16 sm:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Médicos mais bem avaliados
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ranking dos profissionais com melhor avaliação dos pacientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {topDoctors.map((doctor, index) => (
              <div
                key={doctor.name}
                className="bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute top-0 right-0 w-16 h-16 ${
                    doctor.rank === 1
                      ? "bg-yellow-400"
                      : doctor.rank === 2
                      ? "bg-gray-300"
                      : "bg-amber-600"
                  }`}
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                >
                  <span
                    className={`absolute top-2 right-2 text-lg font-bold ${
                      doctor.rank === 1
                        ? "text-yellow-900"
                        : doctor.rank === 2
                        ? "text-gray-700"
                        : "text-amber-100"
                    }`}
                  >
                    #{doctor.rank}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <Avatar
                    className={`w-14 h-14 ${
                      doctor.rank === 1
                        ? "ring-2 ring-yellow-400"
                        : doctor.rank === 2
                        ? "ring-2 ring-gray-300"
                        : "ring-2 ring-amber-600"
                    }`}
                  >
                    <AvatarImage src={doctor.avatar} alt={doctor.name} />
                    <AvatarFallback
                      className={`font-bold text-lg ${
                        doctor.rank === 1
                          ? "bg-yellow-100 text-yellow-700"
                          : doctor.rank === 2
                          ? "bg-gray-100 text-gray-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {getInitials(doctor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-card-foreground">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(doctor.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-foreground">
                      {doctor.rating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {doctor.totalReviews} avaliações
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contato" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Pronto para transformar sua gestão?
            </h2>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8">
              Comece agora mesmo e veja como é fácil gerenciar sua clínica ou
              consultório.
            </p>
            <Link to={isLoggedIn ? "/dashboard" : "/login"}>
              <Button
                variant="secondary"
                size="xl"
                className="hover:scale-105 transition-transform"
              >
                Acessar o Sistema
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xl font-bold text-primary">HealthManager</span>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HealthManager. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
