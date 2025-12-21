import { useState, useRef } from "react";
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
import { FileText, Plus, Pencil, Trash2, Search, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageInput } from "@/components/ImageInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Video, CheckCircle2, UserPlus, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Credenciamento {
  medicoId: string;
  medicoNome: string;
  valorPresencial: string;
  valorTeleconsulta: string;
  atendeTeleconsulta: boolean;
}

interface CredenciamentoProcedimento {
  procedimentoId: string;
  procedimentoNome: string;
  codigoCbhpm: string;
  valor: string;
}

interface PlanoSaude {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  avatar?: string;
  credenciamentos: Credenciamento[];
  procedimentosCredenciados: CredenciamentoProcedimento[];
}

const initialPlanos: PlanoSaude[] = [
  {
    id: "1",
    nome: "Unimed",
    cnpj: "12.345.678/0001-00",
    telefone: "(11) 3333-0001",
    email: "contato@unimed.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Unimed",
    credenciamentos: [
      { medicoId: "1", medicoNome: "Dr. Carlos Santos", valorPresencial: "150.00", valorTeleconsulta: "120.00", atendeTeleconsulta: true }
    ],
    procedimentosCredenciados: [],
  },
  {
    id: "2",
    nome: "Bradesco Saúde",
    cnpj: "23.456.789/0001-11",
    telefone: "(11) 3333-0002",
    email: "contato@bradescosaude.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bradesco%20Saude",
    credenciamentos: [],
    procedimentosCredenciados: [],
  },
  {
    id: "3",
    nome: "Amil",
    cnpj: "34.567.890/0001-22",
    telefone: "(11) 3333-0003",
    email: "contato@amil.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Amil",
    credenciamentos: [],
    procedimentosCredenciados: [],
  },
];

// Dados simulados de procedimentos para seleção
const procedimentosSimulados = [
  { id: "1", codigoCbhpm: "10101012", nome: "Consulta em consultório" },
  { id: "2", codigoCbhpm: "40301010", nome: "Eletrocardiograma" },
  { id: "3", codigoCbhpm: "40808041", nome: "Ultrassonografia de abdome total" },
  { id: "4", codigoCbhpm: "10101234", nome: "Consulta de Retorno" },
  { id: "5", codigoCbhpm: "40302020", nome: "Hemograma Completo" },
];

// Função para formatar moeda brasileira
const formatCurrency = (value: string) => {
  const nums = value.replace(/\D/g, "");
  if (!nums) return "";
  const cents = (parseInt(nums) / 100).toFixed(2);
  return cents.replace(".", ",");
};

// Dados simulados de médicos para seleção
const medicosSimulados = [
  { id: "1", nome: "Dr. Carlos Santos" },
  { id: "2", nome: "Dra. Ana Paula" },
  { id: "3", nome: "Dr. Roberto Lima" },
];

export default function PlanosSaude() {
  const [planos, setPlanos] = useState<PlanoSaude[]>(initialPlanos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPlano, setEditingPlano] = useState<PlanoSaude | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    telefone: "",
    email: "",
    avatar: "",
    credenciamentos: [] as Credenciamento[],
    procedimentosCredenciados: [] as CredenciamentoProcedimento[],
  });
  const [newCredencial, setNewCredencial] = useState<Credenciamento>({
    medicoId: "",
    medicoNome: "",
    valorPresencial: "",
    valorTeleconsulta: "",
    atendeTeleconsulta: false,
  });
  const [newProcCredencial, setNewProcCredencial] = useState<CredenciamentoProcedimento>({
    procedimentoId: "",
    procedimentoNome: "",
    codigoCbhpm: "",
    valor: "",
  });
  const [procSearchTerm, setProcSearchTerm] = useState("");
  const valorInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Novo estado para o termo de busca

  const handleOpenModal = (plano?: PlanoSaude) => {
    if (plano) {
      setEditingPlano(plano);
      setFormData({
        nome: plano.nome,
        cnpj: plano.cnpj,
        telefone: plano.telefone,
        email: plano.email,
        avatar: plano.avatar || "",
        credenciamentos: plano.credenciamentos || [],
        procedimentosCredenciados: plano.procedimentosCredenciados || [],
      });
    } else {
      setEditingPlano(null);
      setFormData({ 
        nome: "", 
        cnpj: "", 
        telefone: "", 
        email: "", 
        avatar: "", 
        credenciamentos: [],
        procedimentosCredenciados: []
      });
    }
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlano(null);
    setFormData({ 
        nome: "", 
        cnpj: "", 
        telefone: "", 
        email: "", 
        avatar: "", 
        credenciamentos: [],
        procedimentosCredenciados: []
    });
    setAvatarFile(null);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.cnpj) {
      toast.error("Erro ao salvar", {
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let avatarUrl = formData.avatar;
    if (avatarFile) {
      // Simular upload: converter arquivo para Base64
      const reader = new FileReader();
      reader.readAsDataURL(avatarFile);
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          avatarUrl = reader.result as string;
          resolve();
        };
      });
    } else if (!formData.avatar && !editingPlano?.avatar) {
      // Gerar um avatar padrão se nenhum for fornecido e for um novo plano
      avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.nome)}`;
    }

    if (editingPlano) {
      setPlanos(planos.map((p) => 
        p.id === editingPlano.id ? { ...p, ...formData, avatar: avatarUrl } : p
      ));
      toast.success("Plano atualizado com sucesso!", {
        description: `${formData.nome} foi atualizado no sistema.`,
      });
    } else {
      const newPlano: PlanoSaude = {
        id: Date.now().toString(),
        ...formData,
        avatar: avatarUrl,
      };
      setPlanos([...planos, newPlano]);
      toast.success("Plano cadastrado com sucesso!", {
        description: `${formData.nome} foi adicionado ao sistema.`,
      });
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    const plano = planos.find((p) => p.id === id);
    setPlanos(planos.filter((p) => p.id !== id));
    toast.info("Plano removido", {
      description: `${plano?.nome} foi removido do sistema.`,
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Filtrar planos com base no termo de busca
  const filteredPlanos = planos.filter((plano) =>
    plano.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: "avatar", 
      label: "Logo",
      render: (plano: PlanoSaude) => (
        <Avatar className="h-9 w-9">
          <AvatarImage src={plano.avatar} alt={plano.nome} />
          <AvatarFallback>{getInitials(plano.nome)}</AvatarFallback>
        </Avatar>
      ),
    },
    { key: "nome" as const, label: "Nome" },
    { key: "cnpj" as const, label: "CNPJ" },
    { key: "telefone" as const, label: "Telefone" },
    {
      key: "procedimentos",
      label: "Procedimentos",
      render: (plano: PlanoSaude) => (
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
          {plano.procedimentosCredenciados?.length || 0} itens
        </span>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (plano: PlanoSaude) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenModal(plano)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(plano.id)}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Planos de Saúde</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os planos de saúde cadastrados no sistema
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar plano por nome..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredPlanos} // Usar dados filtrados
          emptyState={
            <EmptyState
              icon={FileText}
              title="Nenhum plano cadastrado"
              description="Clique em Novo Plano para começar."
              actionLabel="Novo Plano"
              onAction={() => handleOpenModal()}
            />
          }
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto glass border-white/40 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
            <div className="bg-primary/5 p-8 border-b border-border/50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight text-gradient">
                  {editingPlano ? "Editar Plano de Saúde" : "Novo Plano de Saúde"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Gerencie as operadoras de saúde parceiras.
                </p>
              </DialogHeader>
            </div>

            <div className="flex-1">
              <Tabs defaultValue="dados" className="w-full">
                <div className="bg-primary/5 px-8 pt-6">
                  <TabsList className="bg-white/50 border border-white/50 rounded-2xl p-1 h-12">
                    <TabsTrigger value="dados" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">
                      Dados Básicos
                    </TabsTrigger>
                    <TabsTrigger value="medicos" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">
                      Médicos Credenciados
                    </TabsTrigger>
                    <TabsTrigger value="procedimentos" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">
                      Procedimentos
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8 pb-4 h-[500px] overflow-y-auto">
                  <TabsContent value="dados" className="mt-0 space-y-6">
                    <div className="flex justify-center mb-4">
                      <ImageInput
                        label="Logo do Plano"
                        currentImage={formData.avatar}
                        onImageChange={setAvatarFile}
                        fallbackText={getInitials(formData.nome || "Plano")}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="nome" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome do Plano *</Label>
                        <Input
                          id="nome"
                          placeholder="Ex: Unimed Nacional"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 text-base rounded-2xl text-slate-900 placeholder:text-slate-500"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cnpj" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">CNPJ *</Label>
                        <Input
                          id="cnpj"
                          placeholder="00.000.000/0000-00"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900 placeholder:text-slate-500"
                          value={formData.cnpj}
                          onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telefone" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Telefone</Label>
                        <Input
                          id="telefone"
                          placeholder="(00) 0000-0000"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail para Faturamento</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="faturamento@plano.com"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medicos" className="mt-0 space-y-6">
                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                      <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Vincular Novo Médico
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Médico</Label>
                          <select 
                            className="w-full h-11 bg-white border-white/50 rounded-xl px-3 text-sm transition-all focus:border-primary/50 outline-none text-slate-900"
                            value={newCredencial.medicoId}
                            onChange={(e) => {
                              const medico = medicosSimulados.find(m => m.id === e.target.value);
                              if (medico) setNewCredencial({ ...newCredencial, medicoId: medico.id, medicoNome: medico.nome });
                            }}
                          >
                            <option value="">Selecione um médico</option>
                            {medicosSimulados.map(m => (
                              <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Valor Presencial (R$)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input 
                              type="text"
                              className="pl-9 h-11 bg-white border-white/50 rounded-xl text-sm text-slate-900"
                              placeholder="0,00"
                              value={newCredencial.valorPresencial}
                              onChange={(e) => setNewCredencial({ ...newCredencial, valorPresencial: formatCurrency(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Valor Teleconsulta (R$)</Label>
                          <div className="relative">
                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input 
                              type="text"
                              className="pl-9 h-11 bg-white border-white/50 rounded-xl text-sm text-slate-900"
                              placeholder="0,00"
                              disabled={!newCredencial.atendeTeleconsulta}
                              value={newCredencial.valorTeleconsulta}
                              onChange={(e) => setNewCredencial({ ...newCredencial, valorTeleconsulta: formatCurrency(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 h-11">
                          <Switch 
                            checked={newCredencial.atendeTeleconsulta}
                            onCheckedChange={(checked) => setNewCredencial({ ...newCredencial, atendeTeleconsulta: checked })}
                          />
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Teleconsulta</Label>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <Button 
                            className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
                            onClick={() => {
                              if (!newCredencial.medicoId || !newCredencial.valorPresencial || (newCredencial.atendeTeleconsulta && !newCredencial.valorTeleconsulta)) {
                                toast.error("Preencha o médico e os valores correspondentes.");
                                return;
                              }
                              setFormData({ ...formData, credenciamentos: [...formData.credenciamentos, newCredencial] });
                              setNewCredencial({ medicoId: "", medicoNome: "", valorPresencial: "", valorTeleconsulta: "", atendeTeleconsulta: false });
                              toast.success("Vínculo adicionado!");
                            }}
                          >
                            Adicionar ao Plano
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground ml-1">Médicos Vinculados</h3>
                      {formData.credenciamentos.length === 0 ? (
                        <div className="text-center py-8 bg-white/30 rounded-3xl border border-dashed border-white/50">
                          <p className="text-sm text-muted-foreground">Nenhum médico vinculado a este plano.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {formData.credenciamentos.map((cred, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white/50 border border-white/50 rounded-2xl group hover:border-primary/30 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                  {getInitials(cred.medicoNome)}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-800">{cred.medicoNome}</p>
                                  <div className="flex flex-wrap items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold text-primary flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-full">
                                      <DollarSign className="h-3 w-3" />
                                      Presencial: R$ {cred.valorPresencial}
                                    </span>
                                    {cred.atendeTeleconsulta && (
                                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        <Video className="h-3 w-3" />
                                        Tele: R$ {cred.valorTeleconsulta}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-red-600 rounded-xl"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    credenciamentos: formData.credenciamentos.filter((_, i) => i !== index)
                                  });
                                }}
                              >
                                <XCircle className="h-5 w-5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="procedimentos" className="mt-0 space-y-6">
                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                      <h3 className="text-sm font-black uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        Vincular Procedimento
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Buscar Procedimento (Nome ou CBHPM)</Label>
                          <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <input 
                              type="text"
                              placeholder="Digite o nome ou código..."
                              className="w-full h-11 bg-white border-white/50 rounded-xl pl-10 pr-3 text-sm transition-all focus:ring-2 focus:ring-primary/20 outline-none text-slate-900 shadow-sm"
                              value={procSearchTerm}
                              onChange={(e) => setProcSearchTerm(e.target.value)}
                            />
                            
                            {procSearchTerm && (
                                <div className="absolute top-full left-0 w-full bg-white border border-border shadow-2xl rounded-2xl mt-2 z-50 max-h-[250px] overflow-y-auto p-2 glass">
                                    {procedimentosSimulados
                                        .filter(p => 
                                            p.nome.toLowerCase().includes(procSearchTerm.toLowerCase()) || 
                                            p.codigoCbhpm.includes(procSearchTerm)
                                        )
                                        .map(proc => (
                                            <button
                                                key={proc.id}
                                                type="button"
                                                className="w-full text-left p-3 hover:bg-primary/5 rounded-xl transition-colors flex items-center justify-between group/item"
                                                onClick={() => {
                                                    const isAlreadyLinked = (formData.procedimentosCredenciados || []).some(
                                                        p => p.procedimentoId === proc.id
                                                    );

                                                    if (isAlreadyLinked) {
                                                        toast.error("Este procedimento já está vinculado a este plano.");
                                                        return;
                                                    }

                                                    setNewProcCredencial({
                                                        ...newProcCredencial,
                                                        procedimentoId: proc.id,
                                                        procedimentoNome: proc.nome,
                                                        codigoCbhpm: proc.codigoCbhpm
                                                    });
                                                    setProcSearchTerm("");
                                                    
                                                    // Passar o foco para o campo de valor após um pequeno delay para garantir que o input esteja pronto
                                                    setTimeout(() => {
                                                        valorInputRef.current?.focus();
                                                    }, 100);
                                                }}
                                            >
                                                <div>
                                                    <p className="text-sm font-black text-slate-800">{proc.nome}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{proc.codigoCbhpm}</p>
                                                </div>
                                                <Plus className="h-4 w-4 text-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                            </button>
                                        ))
                                    }
                                    {procedimentosSimulados.filter(p => 
                                        p.nome.toLowerCase().includes(procSearchTerm.toLowerCase()) || 
                                        p.codigoCbhpm.includes(procSearchTerm)
                                    ).length === 0 && (
                                        <p className="text-center py-4 text-xs text-muted-foreground italic">Nenhum procedimento encontrado.</p>
                                    )}
                                </div>
                            )}
                          </div>
                          
                          {newProcCredencial.procedimentoId && (
                              <div className="mt-3 p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-between">
                                  <div>
                                      <p className="text-xs font-black text-primary uppercase tracking-widest">Selecionado:</p>
                                      <p className="text-sm font-bold text-slate-800">{newProcCredencial.procedimentoNome} ({newProcCredencial.codigoCbhpm})</p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    type="button"
                                    className="text-destructive h-8 w-8 p-0"
                                    onClick={() => setNewProcCredencial({ ...newProcCredencial, procedimentoId: "", procedimentoNome: "", codigoCbhpm: "" })}
                                  >
                                      <XCircle className="h-4 w-4" />
                                  </Button>
                              </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Valor do Procedimento (R$)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input 
                              ref={valorInputRef}
                              type="text"
                              className="pl-10 h-11 bg-white border-white/50 rounded-xl text-sm text-slate-900"
                              placeholder="0,00"
                              value={newProcCredencial.valor}
                              onChange={(e) => setNewProcCredencial({ ...newProcCredencial, valor: formatCurrency(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                          <Button 
                            type="button"
                            className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
                            onClick={() => {
                              if (!newProcCredencial.procedimentoId || !newProcCredencial.valor) {
                                toast.error("Selecione um procedimento e defina o valor.");
                                return;
                              }
                              setFormData({ 
                                ...formData, 
                                procedimentosCredenciados: [...(formData.procedimentosCredenciados || []), newProcCredencial] 
                              });
                              setNewProcCredencial({ procedimentoId: "", procedimentoNome: "", codigoCbhpm: "", valor: "" });
                              toast.success("Procedimento vinculado!");
                            }}
                          >
                            Adicionar ao Plano
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pb-8">
                      <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground ml-1">Procedimentos Vinculados</h3>
                      {(formData.procedimentosCredenciados || []).length === 0 ? (
                        <div className="text-center py-8 bg-white/30 rounded-3xl border border-dashed border-white/50">
                          <p className="text-sm text-muted-foreground">Nenhum procedimento vinculado.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(formData.procedimentosCredenciados || []).map((proc, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white/50 border border-white/50 rounded-2xl group hover:border-primary/30 transition-all shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                                  <ClipboardList className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-800">{proc.procedimentoNome}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">
                                      CBHPM: {proc.codigoCbhpm}
                                    </span>
                                    <span className="text-[10px] font-bold text-primary flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-full">
                                      <DollarSign className="h-3 w-3" />
                                      Valor: R$ {proc.valor}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-red-600 rounded-xl"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    procedimentosCredenciados: formData.procedimentosCredenciados.filter((_, i) => i !== index)
                                  });
                                }}
                              >
                                <XCircle className="h-5 w-5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            <div className="p-8 bg-secondary/30 flex justify-end gap-4 border-t border-border/50">
              <Button variant="ghost" onClick={handleCloseModal} className="font-bold text-slate-600 hover:bg-white hover:text-slate-900 rounded-2xl h-12 px-6">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isLoading} className="font-black h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                {isLoading ? "Salvando..." : "Confirmar Plano"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}