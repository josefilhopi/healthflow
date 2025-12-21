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
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-32 overflow-hidden mesh-gradient">
        {/* Adorno decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-50">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] animate-fade-in">
              Gestão de saúde <br />
              <span className="text-gradient">inteligente e ágil</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up leading-relaxed">
              Simplifique a administração da sua clínica ou consultório com uma
              plataforma que une elegância e eficiência. Controle tudo em um só lugar.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center animate-slide-up">
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                <Button variant="hero" size="xl" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                  Começar Gratuitamente
                </Button>
              </Link>
              <a href="#servicos">
                <Button variant="outline" size="xl" className="backdrop-blur-sm border-primary/20 hover:bg-primary/5">
                  Conhecer Recursos
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-20 animate-fade-in relative">
             {/* Efeito de brilho atrás do carousel */}
            <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-[3rem] -z-10" />
            <div className="mx-auto w-full max-w-6xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="servicos" className="py-20 sm:py-32 bg-secondary/20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Tudo que você precisa
            </h2>
            <div className="h-1.5 w-20 bg-primary mx-auto mt-4 rounded-full" />
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas completas projetadas para elevar o padrão de gestão da sua clínica.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed italic line-clamp-3">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Doctors Section */}
      <section className="py-20 sm:py-32 mesh-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Médicos mais bem avaliados
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ranking dos profissionais com melhor avaliação dos pacientes no sistema.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topDoctors.map((doctor, index) => (
              <div
                key={doctor.name}
                className="glass p-8 rounded-2xl transition-all duration-500 hover:scale-[1.02] animate-fade-in relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute top-0 right-0 w-20 h-20 ${
                    doctor.rank === 1
                      ? "bg-yellow-400"
                      : doctor.rank === 2
                      ? "bg-gray-300"
                      : "bg-amber-600"
                  }`}
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                >
                  <span
                    className={`absolute top-3 right-3 text-xl font-extrabold ${
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

                <div className="flex flex-col items-center text-center gap-4 mb-6">
                  <Avatar
                    className={`w-20 h-20 ${
                      doctor.rank === 1
                        ? "ring-4 ring-yellow-400/30"
                        : doctor.rank === 2
                        ? "ring-4 ring-gray-300/30"
                        : "ring-4 ring-amber-600/30"
                    }`}
                  >
                    <AvatarImage src={doctor.avatar} alt={doctor.name} />
                    <AvatarFallback
                      className={`font-bold text-2xl ${
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
                    <h3 className="text-xl font-bold text-foreground">
                      {doctor.name}
                    </h3>
                    <p className="text-primary font-medium">
                      {doctor.specialty}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 mt-6 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(doctor.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-extrabold text-foreground text-lg">
                      {doctor.rating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    {doctor.totalReviews} avaliações verificadas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Sobre Nós</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Bem-vindo ao HealthFlow! Somos uma plataforma dedicada a facilitar a gestão de saúde, conectando pacientes, médicos e clínicas de forma eficiente e intuitiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Nossa Missão</h3>
              <p className="text-muted-foreground">
                Proporcionar uma experiência simplificada e acessível para todos os envolvidos no cuidado com a saúde, utilizando tecnologia de ponta para melhorar a qualidade de vida.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Nossos Valores</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Inovação</li>
                <li>Transparência</li>
                <li>Compromisso com a saúde</li>
                <li>Foco no usuário</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contato" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary relative overflow-hidden rounded-[2rem] p-12 sm:p-20 text-center shadow-2xl">
            {/* Adorno de brilho no CTA */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-primary-foreground tracking-tight mb-6">
                Pronto para transformar sua gestão?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                Junte-se a centenas de clínicas que já modernizaram seu atendimento com o HealthFlow.
              </p>
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                <Button
                  variant="secondary"
                  size="xl"
                  className="px-12 py-8 text-xl font-bold bg-white text-primary hover:bg-white/90 hover:scale-105 shadow-xl transition-all duration-300"
                >
                  Experimentar Agora
                </Button>
              </Link>
            </div>
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
