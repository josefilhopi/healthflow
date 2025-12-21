import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Stethoscope, Plus, Pencil, Trash2, Search, ShieldCheck, Key, Calendar, FileType } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageInput } from "@/components/ImageInput";
import { Check, ChevronsUpDown, Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Lista de especialidades para o exemplo (poderia vir de um contexto ou estado global)
const especialidadesDisponiveis = [
  "Cardiologia", "Dermatologia", "Ortopedia", "Pediatria", 
  "Ginecologia", "Neurologia", "Psiquiatria", "Oftalmologia",
  "Otorrinolaringologia", "Endocrinologia"
];

interface Horario {
  id: string;
  diaSemana: number;
  inicio: string;
  fim: string;
}

interface Medico {
  id: string;
  nome: string;
  especialidades: string[];
  crm: string;
  telefone: string;
  email: string;
  avatar?: string;
  horarios?: Horario[];
  duracaoConsulta: string;
  duracaoRetorno: string;
  hasCertificado: boolean;
  certificadoSenha?: string;
  certificadoValidade?: string;
  certificadoNomeArquivo?: string;
  ativo: boolean;
}

const initialMedicos: Medico[] = [
  {
    id: "1",
    nome: "Dr. Carlos Santos",
    especialidades: ["Cardiologia"],
    crm: "12345-SP",
    telefone: "(11) 99999-0001",
    email: "carlos@email.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Carlos%20Santos",
    duracaoConsulta: "30",
    duracaoRetorno: "15",
    hasCertificado: false,
    ativo: true,
  },
  {
    id: "2",
    nome: "Dra. Ana Paula",
    especialidades: ["Dermatologia"],
    crm: "23456-SP",
    telefone: "(11) 99999-0002",
    email: "ana@email.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ana%20Paula",
    duracaoConsulta: "40",
    duracaoRetorno: "20",
    hasCertificado: false,
    ativo: true,
  },
  {
    id: "3",
    nome: "Dr. Roberto Lima",
    especialidades: ["Ortopedia", "Traumatologia"],
    crm: "34567-SP",
    telefone: "(11) 99999-0003",
    email: "roberto@email.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Roberto%20Lima",
    duracaoConsulta: "20",
    duracaoRetorno: "10",
    hasCertificado: false,
    ativo: true,
  },
];

export default function Medicos() {
  const [medicos, setMedicos] = useState<Medico[]>(initialMedicos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHorariosModalOpen, setIsHorariosModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMedico, setEditingMedico] = useState<Medico | null>(null);
  const [currentDiaIndex, setCurrentDiaIndex] = useState(1); // Segunda por padrão
  const [newRange, setNewRange] = useState({ inicio: "08:00", fim: "12:00" });
  const [formData, setFormData] = useState({
    nome: "",
    especialidades: [] as string[],
    crm: "",
    telefone: "",
    email: "",
    avatar: "",
    duracaoConsulta: "30",
    duracaoRetorno: "15",
    hasCertificado: false,
    certificadoSenha: "",
    certificadoValidade: "",
    certificadoNomeArquivo: "",
    ativo: true,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Novo estado para o termo de busca
  const [espSearchTerm, setEspSearchTerm] = useState("");
  const [isEspDropdownOpen, setIsEspDropdownOpen] = useState(false);
  
  const handleOpenModal = (medico?: Medico) => {
    if (medico) {
      setEditingMedico(medico);
      setFormData({
        nome: medico.nome,
        especialidades: medico.especialidades,
        crm: medico.crm,
        telefone: medico.telefone,
        email: medico.email,
        avatar: medico.avatar || "",
        duracaoConsulta: medico.duracaoConsulta || "30",
        duracaoRetorno: medico.duracaoRetorno || "15",
        hasCertificado: medico.hasCertificado || false,
        certificadoSenha: medico.certificadoSenha || "",
        certificadoValidade: medico.certificadoValidade || "",
        certificadoNomeArquivo: medico.certificadoNomeArquivo || "",
        ativo: medico.ativo ?? true,
      });
    } else {
      setEditingMedico(null);
      setFormData({ 
        nome: "", 
        especialidades: [], 
        crm: "", 
        telefone: "", 
        email: "", 
        avatar: "",
        duracaoConsulta: "30",
        duracaoRetorno: "15",
        hasCertificado: false,
        certificadoSenha: "",
        certificadoValidade: "",
        certificadoNomeArquivo: "",
        ativo: true,
      });
    }
    setAvatarFile(null); // Reset avatar file
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedico(null);
    setFormData({ 
      nome: "", 
      especialidades: [], 
      crm: "", 
      telefone: "", 
      email: "", 
      avatar: "",
      duracaoConsulta: "30",
      duracaoRetorno: "15",
      hasCertificado: false,
      certificadoSenha: "",
      certificadoValidade: "",
      certificadoNomeArquivo: "",
      ativo: true,
    });
    setAvatarFile(null);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.crm) {
      toast.error("Erro ao salvar", {
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    let avatarUrl = formData.avatar;
    if (avatarFile) {
      // Simulate upload: convert file to Base64
      const reader = new FileReader();
      reader.readAsDataURL(avatarFile);
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          avatarUrl = reader.result as string;
          resolve();
        };
      });
    } else if (!formData.avatar && !editingMedico?.avatar) {
      // Generate a default avatar if none is provided and it's a new doctor
      avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.nome)}`;
    }

    if (editingMedico) {
      setMedicos(medicos.map((m) => 
        m.id === editingMedico.id ? { ...m, ...formData, avatar: avatarUrl } : m
      ));
      toast.success("Médico atualizado com sucesso!", {
        description: `${formData.nome} foi atualizado no sistema.`,
      });
    } else {
      const newMedico: Medico = {
        id: Date.now().toString(),
        ...formData,
        avatar: avatarUrl,
      };
      setMedicos([...medicos, newMedico]);
      toast.success("Médico cadastrado com sucesso!", {
        description: `${formData.nome} foi adicionado ao sistema.`,
      });
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    const medico = medicos.find((m) => m.id === id);
    setMedicos(medicos.filter((m) => m.id !== id));
    toast.info("Médico removido", {
      description: `${medico?.nome} foi removido do sistema.`,
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Filtrar médicos com base no termo de busca
  const filteredMedicos = medicos.filter((medico) =>
    medico.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: "avatar", 
      label: "Foto",
      render: (medico: Medico) => (
        <Avatar className="h-9 w-9">
          <AvatarImage src={medico.avatar} alt={medico.nome} />
          <AvatarFallback>{getInitials(medico.nome)}</AvatarFallback>
        </Avatar>
      ),
    },
    { key: "nome" as const, label: "Nome" },
    { 
      key: "especialidades" as const, 
      label: "Especialidades",
      render: (medico: Medico) => (
        <div className="flex flex-wrap gap-1">
          {medico.especialidades.map((esp, i) => (
            <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
              {esp}
            </span>
          ))}
        </div>
      )
    },
    {
      key: "status" as const,
      label: "Status",
      render: (medico: Medico) => (
        <Badge variant="outline" className={cn(
          "font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full",
          medico.ativo ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200"
        )}>
          {medico.ativo ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    { key: "crm" as const, label: "CRM" },
    { key: "telefone" as const, label: "Telefone" },
    {
      key: "actions",
      label: "Ações",
      render: (medico: Medico) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingMedico(medico);
              setIsHorariosModalOpen(true);
            }}
            className="text-primary hover:text-primary hover:bg-primary/5"
            title="Horários de Atendimento"
          >
            <Clock className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenModal(medico)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(medico.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Médicos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os médicos cadastrados no sistema
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Médico
          </Button>
        </div>

        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar por nome, CRM ou especialidade..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredMedicos} // Usar dados filtrados
          emptyState={
            <EmptyState
              icon={Stethoscope}
              title="Nenhum médico cadastrado"
              description="Clique em Novo Médico para começar."
              actionLabel="Novo Médico"
              onAction={() => handleOpenModal()}
            />
          }
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto glass border-white/40 shadow-2xl rounded-[2.5rem] p-0">
            <div className="bg-primary/5 p-8 border-b border-border/50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight text-gradient">
                  {editingMedico ? "Editar Médico" : "Novo Médico"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Insira as informações profissionais abaixo.
                </p>
              </DialogHeader>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div className="flex justify-center mb-4">
                  <ImageInput
                    label="Foto do Médico"
                    currentImage={formData.avatar}
                    onImageChange={setAvatarFile}
                    fallbackText={getInitials(formData.nome || "Médico")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nome" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome completo *</Label>
                    <Input
                      id="nome"
                      placeholder="Dr(a). Nome Sobrenome"
                      className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 text-base rounded-2xl text-slate-900 placeholder:text-slate-500"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="crm" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">CRM *</Label>
                    <Input
                      id="crm"
                      placeholder="0000000-0"
                      className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900 placeholder:text-slate-500"
                      value={formData.crm}
                      onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Especialidades</Label>
                    
                    {/* Busca de Especialidades */}
                    <div className="relative group mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input 
                        placeholder="Buscar e adicionar especialidade (ex: Cardiologia)..."
                        className="pl-10 h-12 bg-white/50 border-white/50 focus:bg-white transition-all duration-300 rounded-2xl text-slate-900 placeholder:text-slate-500 shadow-sm"
                        value={espSearchTerm}
                        onChange={(e) => {
                            setEspSearchTerm(e.target.value);
                            setIsEspDropdownOpen(true);
                        }}
                        onFocus={() => setIsEspDropdownOpen(true)}
                      />
                      
                      {isEspDropdownOpen && espSearchTerm && (
                          <div className="absolute top-full left-0 w-full bg-white border border-border shadow-2xl rounded-2xl mt-2 z-50 max-h-[250px] overflow-y-auto p-2 glass">
                              {especialidadesDisponiveis
                                  .filter(esp => esp.toLowerCase().includes(espSearchTerm.toLowerCase()))
                                  .map(esp => {
                                      const isAlreadyAdded = formData.especialidades.includes(esp);
                                      return (
                                          <button
                                              key={esp}
                                              type="button"
                                              disabled={isAlreadyAdded}
                                              className={cn(
                                                  "w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between group/item",
                                                  isAlreadyAdded ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/5"
                                              )}
                                              onClick={() => {
                                                  if (!isAlreadyAdded) {
                                                      setFormData({
                                                          ...formData,
                                                          especialidades: [...formData.especialidades, esp]
                                                      });
                                                      setEspSearchTerm("");
                                                      setIsEspDropdownOpen(false);
                                                      toast.success(`Especialidade ${esp} adicionada!`);
                                                  }
                                              }}
                                          >
                                              <span className="text-sm font-bold text-slate-800">{esp}</span>
                                              {isAlreadyAdded ? (
                                                  <Check className="h-4 w-4 text-green-500" />
                                              ) : (
                                                  <Plus className="h-4 w-4 text-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                              )}
                                          </button>
                                      );
                                  })
                              }
                              {especialidadesDisponiveis.filter(esp => 
                                  esp.toLowerCase().includes(espSearchTerm.toLowerCase())
                              ).length === 0 && (
                                  <p className="text-center py-4 text-xs text-muted-foreground italic">Nenhuma especialidade encontrada.</p>
                              )}
                          </div>
                      )}
                    </div>

                    {/* Lista de Especialidades Vinculadas */}
                    <div className="flex flex-wrap gap-2 p-4 bg-white/50 border border-white/50 border-dashed rounded-[2rem] min-h-[120px] items-start">
                      {formData.especialidades.length === 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center py-4 opacity-40">
                          <Stethoscope className="h-8 w-8 mb-2" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-center">Nenhuma especialidade vinculada</p>
                        </div>
                      ) : (
                        formData.especialidades.map((esp) => (
                          <div
                            key={esp}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-primary/20 flex items-center gap-2 group animate-in fade-in zoom-in duration-300"
                          >
                            <span className="uppercase tracking-wider">{esp}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  especialidades: formData.especialidades.filter(e => e !== esp)
                                });
                              }}
                              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <Plus className="h-3 w-3 rotate-45" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Telefone de Contato</Label>
                    <Input
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900 placeholder:text-slate-500"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail Profissional</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="medico@clinica.com"
                      className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900 placeholder:text-slate-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2 flex flex-col justify-center">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2">Status da Conta</Label>
                    <div className="flex items-center gap-3 p-3 bg-white/40 border border-white/60 rounded-2xl">
                      <Switch
                        checked={formData.ativo}
                        onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                      />
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        formData.ativo ? "text-green-600" : "text-slate-500"
                      )}>
                        {formData.ativo ? "Médico Ativo" : "Médico Inativo"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duracaoConsulta" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Duração da Consulta</Label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                          id="duracaoConsulta"
                          type="number"
                          placeholder="Minutos"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 pl-10 rounded-2xl text-slate-900 placeholder:text-slate-500"
                          value={formData.duracaoConsulta}
                          onChange={(e) => setFormData({ ...formData, duracaoConsulta: e.target.value })}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase">min</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duracaoRetorno" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Duração do Retorno</Label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                          id="duracaoRetorno"
                          type="number"
                          placeholder="Minutos"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 pl-10 rounded-2xl text-slate-900 placeholder:text-slate-500"
                          value={formData.duracaoRetorno}
                          onChange={(e) => setFormData({ ...formData, duracaoRetorno: e.target.value })}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase">min</span>
                    </div>
                  </div>

                  {/* Seção de Certificado Digital */}
                  <div className="space-y-4 md:col-span-2 mt-4 p-6 bg-white/40 border border-white/60 rounded-[2rem] shadow-inner">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4" /> Certificado Digital A1
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Arquivo do Certificado (.pfx / .p12)</Label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="cert-upload"
                                    className="hidden"
                                    accept=".pfx,.p12"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Simular captura de validade (1 ano a partir de agora para exemplo)
                                            const validade = new Date();
                                            validade.setFullYear(validade.getFullYear() + 1);
                                            
                                            setFormData({
                                                ...formData,
                                                hasCertificado: true,
                                                certificadoNomeArquivo: file.name,
                                                certificadoValidade: validade.toLocaleDateString('pt-BR')
                                            });
                                            toast.success("Certificado carregado com sucesso!");
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 rounded-xl bg-white/70 border-dashed border-primary/30 flex items-center gap-2 hover:bg-white hover:border-primary transition-all duration-300"
                                    onClick={() => document.getElementById('cert-upload')?.click()}
                                >
                                    <FileType className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]">
                                        {formData.certificadoNomeArquivo || "Selecionar Certificado A1"}
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cert-senha" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Senha do Certificado</Label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    id="cert-senha"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-white/70 border-white/50 h-12 rounded-xl text-slate-900 pl-10"
                                    value={formData.certificadoSenha}
                                    onChange={(e) => setFormData({ ...formData, certificadoSenha: e.target.value })}
                                />
                            </div>
                        </div>

                        {formData.hasCertificado && (
                            <div className="md:col-span-2 flex items-center gap-2 px-4 py-3 bg-green-50/50 border border-green-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                <Calendar className="h-4 w-4 text-green-600" />
                                <p className="text-xs font-bold text-green-700">
                                    Validade detectada: <span className="font-black underline">{formData.certificadoValidade}</span>
                                </p>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-secondary/30 flex justify-end gap-4 border-t border-border/50">
              <Button variant="ghost" onClick={handleCloseModal} className="font-bold text-slate-600 hover:bg-white hover:text-slate-900 rounded-2xl h-12 px-6">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isLoading} className="font-black h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                {isLoading ? "Salvando..." : "Confirmar Cadastro"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Horários */}
        <Dialog open={isHorariosModalOpen} onOpenChange={setIsHorariosModalOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto glass border-white/40 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
            <div className="bg-primary/5 p-8 border-b border-border/50">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <DialogTitle className="text-2xl font-black tracking-tight text-gradient">
                    Agenda: {editingMedico?.nome}
                  </DialogTitle>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Configure os horários de atendimento por dia da semana (0-Domingo a 7-Sábado).
                </p>
              </DialogHeader>
            </div>

            <div className="p-8 space-y-8">
              {/* Seletor de Dias */}
              <div className="flex flex-wrap gap-2">
                {["DOM (0)", "SEG (1)", "TER (2)", "QUA (3)", "QUI (4)", "SEX (5)", "SÁB (6)", "SÁB (7)"].map((dia, idx) => {
                  const isActive = currentDiaIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentDiaIndex(idx)}
                      className={cn(
                        "flex-1 min-w-[70px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105" 
                          : "bg-white/40 text-muted-foreground hover:bg-white/80 hover:text-primary border border-white/20"
                      )}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Novo Intervalo */}
                <div className="space-y-6 bg-white/40 p-8 rounded-[2.5rem] border border-white/60 shadow-inner">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-2">
                    <Plus className="h-4 w-4" /> Adicionar Novo Turno
                  </h4>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Início</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input 
                          type="time" 
                          value={newRange.inicio}
                          onChange={(e) => setNewRange({ ...newRange, inicio: e.target.value })}
                          className="bg-white/70 border-white/50 h-12 rounded-xl text-slate-900 pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Fim</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input 
                          type="time" 
                          value={newRange.fim}
                          onChange={(e) => setNewRange({ ...newRange, fim: e.target.value })}
                          className="bg-white/70 border-white/50 h-12 rounded-xl text-slate-900 pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full h-12 rounded-2xl font-black bg-primary shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm uppercase tracking-wider"
                    onClick={() => {
                      if (!editingMedico) return;
                      const newHorario: Horario = {
                        id: Date.now().toString(),
                        diaSemana: currentDiaIndex,
                        inicio: newRange.inicio,
                        fim: newRange.fim
                      };
                      const updatedHorarios = [...(editingMedico.horarios || []), newHorario];
                      setMedicos(medicos.map(m => m.id === editingMedico.id ? { ...m, horarios: updatedHorarios } : m));
                      setEditingMedico({ ...editingMedico, horarios: updatedHorarios });
                      toast.success("Horário vinculado com sucesso!");
                    }}
                  >
                    Vincular ao Dia {currentDiaIndex}
                  </Button>
                </div>

                {/* Lista de Horários do Dia */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Horários Definidos para o Dia {currentDiaIndex}
                  </h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {(editingMedico?.horarios || [])?.filter(h => h.diaSemana === currentDiaIndex).length === 0 ? (
                      <div className="text-center py-12 bg-white/20 rounded-[2rem] border-2 border-dashed border-white/40">
                        <CalendarDays className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">Nenhum turno definido</p>
                      </div>
                    ) : (
                      (editingMedico?.horarios || [])?.filter(h => h.diaSemana === currentDiaIndex).map((horario) => (
                        <div key={horario.id} className="flex items-center justify-between p-5 bg-white/60 border border-white/60 rounded-3xl group hover:border-primary/40 hover:bg-white/80 transition-all duration-300 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-base font-black text-slate-800 tracking-tight">
                                    {horario.inicio} — {horario.fim}
                                </span>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Atendimento Presencial</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive opacity-0 group-hover:opacity-100 transition-all p-0 h-10 w-10 rounded-xl hover:bg-red-50"
                            onClick={() => {
                              const updatedHorarios = editingMedico.horarios?.filter(h => h.id !== horario.id);
                              setMedicos(medicos.map(m => m.id === editingMedico.id ? { ...m, horarios: updatedHorarios } : m));
                              setEditingMedico({ ...editingMedico, horarios: updatedHorarios });
                              toast.info("Horário removido.");
                            }}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-secondary/30 flex justify-end border-t border-border/50">
              <Button 
                onClick={() => setIsHorariosModalOpen(false)} 
                className="font-black h-14 px-12 rounded-[1.5rem] shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all text-base"
              >
                Concluir Configuração
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}