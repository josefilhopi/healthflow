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
import { Users, Plus, Pencil, Trash2, Search, FileText, ClipboardList, Receipt, ScrollText, CheckCircle2, XCircle, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageInput } from "@/components/ImageInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  sexo: "Masculino" | "Feminino" | "Outro";
  verificado: boolean;
  avatar?: string;
  laudos: any[];
  prescricoes: any[];
  anamneses: any[];
  receitas: any[];
}

const initialPacientes: Paciente[] = [
  {
    id: "1",
    nome: "Maria Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 98888-0001",
    email: "maria@email.com",
    dataNascimento: "1985-03-15",
    sexo: "Feminino",
    verificado: true,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Maria%20Silva",
    laudos: [], prescricoes: [], anamneses: [], receitas: []
  },
  {
    id: "2",
    nome: "João Santos",
    cpf: "234.567.890-11",
    telefone: "(11) 98888-0002",
    email: "joao@email.com",
    dataNascimento: "1990-07-22",
    sexo: "Masculino",
    verificado: false,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Joao%20Santos",
    laudos: [], prescricoes: [], anamneses: [], receitas: []
  },
  {
    id: "3",
    nome: "Ana Costa",
    cpf: "345.678.901-22",
    telefone: "(11) 98888-0003",
    email: "ana@email.com",
    dataNascimento: "1978-11-08",
    sexo: "Feminino",
    verificado: true,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ana%20Costa",
    laudos: [], prescricoes: [], anamneses: [], receitas: []
  },
];

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>(initialPacientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    dataNascimento: "",
    sexo: "Masculino" as "Masculino" | "Feminino" | "Outro",
    verificado: false,
    avatar: "",
    laudos: [] as any[],
    prescricoes: [] as any[],
    anamneses: [] as any[],
    receitas: [] as any[],
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Novo estado para o termo de busca

  const handleOpenModal = (paciente?: Paciente) => {
    if (paciente) {
      setEditingPaciente(paciente);
      setFormData({
        nome: paciente.nome,
        cpf: paciente.cpf,
        telefone: paciente.telefone,
        email: paciente.email,
        dataNascimento: paciente.dataNascimento,
        sexo: paciente.sexo,
        verificado: paciente.verificado,
        avatar: paciente.avatar || "",
        laudos: paciente.laudos || [],
        prescricoes: paciente.prescricoes || [],
        anamneses: paciente.anamneses || [],
        receitas: paciente.receitas || [],
      });
    } else {
      setEditingPaciente(null);
      setFormData({ 
        nome: "", 
        cpf: "", 
        telefone: "", 
        email: "", 
        dataNascimento: "", 
        sexo: "Masculino", 
        verificado: false, 
        avatar: "",
        laudos: [],
        prescricoes: [],
        anamneses: [],
        receitas: []
      });
    }
    setAvatarFile(null); // Reset avatar file
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPaciente(null);
    setFormData({ 
      nome: "", 
      cpf: "", 
      telefone: "", 
      email: "", 
      dataNascimento: "", 
      sexo: "Masculino", 
      verificado: false, 
      avatar: "",
      laudos: [],
      prescricoes: [],
      anamneses: [],
      receitas: []
    });
    setAvatarFile(null);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.cpf) {
      toast.error("Erro ao salvar", {
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    setIsLoading(true);
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
    } else if (!formData.avatar && !editingPaciente?.avatar) {
      // Generate a default avatar if none is provided and it's a new patient
      avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.nome)}`;
    }


    if (editingPaciente) {
      setPacientes(pacientes.map((p) => 
        p.id === editingPaciente.id ? { ...p, ...formData, avatar: avatarUrl } : p
      ));
      toast.success("Paciente atualizado com sucesso!", {
        description: `${formData.nome} foi atualizado no sistema.`,
      });
    } else {
      const newPaciente: Paciente = {
        id: Date.now().toString(),
        ...formData,
        avatar: avatarUrl,
      };
      setPacientes([...pacientes, newPaciente]);
      toast.success("Paciente cadastrado com sucesso!", {
        description: `${formData.nome} foi adicionado ao sistema.`,
      });
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    const paciente = pacientes.find((p) => p.id === id);
    setPacientes(pacientes.filter((p) => p.id !== id));
    toast.info("Paciente removido", {
      description: `${paciente?.nome} foi removido do sistema.`,
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Filtrar pacientes com base no termo de busca
  const filteredPacientes = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: "avatar", 
      label: "Foto",
      render: (paciente: Paciente) => (
        <Avatar className="h-9 w-9">
          <AvatarImage src={paciente.avatar} alt={paciente.nome} />
          <AvatarFallback>{getInitials(paciente.nome)}</AvatarFallback>
        </Avatar>
      ),
    },
    { key: "nome" as const, label: "Nome" },
    { key: "cpf" as const, label: "CPF" },
    { key: "telefone" as const, label: "Telefone" },
    { key: "email" as const, label: "E-mail" },
    {
      key: "verificado",
      label: "Status",
      render: (paciente: Paciente) => (
        <Badge variant={paciente.verificado ? "default" : "secondary"} className={cn(
          "gap-1 rounded-lg px-2",
          paciente.verificado ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-500 hover:bg-slate-100"
        )}>
          {paciente.verificado ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
          {paciente.verificado ? "Verificado" : "Pendente"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (paciente: Paciente) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenModal(paciente)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(paciente.id)}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os pacientes cadastrados no sistema
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Paciente
          </Button>
        </div>

        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente por nome..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredPacientes} // Usar dados filtrados
          emptyState={
            <EmptyState
              icon={Users}
              title="Nenhum paciente cadastrado"
              description="Clique em Novo Paciente para começar."
              actionLabel="Novo Paciente"
              onAction={() => handleOpenModal()}
            />
          }
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-xl max-h-[95vh] overflow-y-auto glass border-white/40 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
            <div className="bg-primary/5 p-8 border-b border-border/50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight text-gradient">
                  {editingPaciente ? "Editar Paciente" : "Novo Paciente"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Preencha os campos abaixo para concluir o cadastro.
                </p>
              </DialogHeader>
            </div>

            <div className="p-0">
              <Tabs defaultValue="cadastro" className="w-full">
                <div className="px-8 bg-white/50 border-b border-border/50">
                  <TabsList className="h-14 bg-transparent gap-8 p-0">
                    <TabsTrigger value="cadastro" className="h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-black uppercase tracking-widest text-[10px] text-muted-foreground data-[state=active]:text-primary transition-all">
                      Dados Básicos
                    </TabsTrigger>
                    <TabsTrigger value="prontuario" className="h-14 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-black uppercase tracking-widest text-[10px] text-muted-foreground data-[state=active]:text-primary transition-all">
                      Prontuário
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8">
                  <TabsContent value="cadastro" className="mt-0 space-y-6">
                    <div className="flex justify-center mb-8">
                      <ImageInput
                        label="Foto do Paciente"
                        currentImage={formData.avatar}
                        onImageChange={setAvatarFile}
                        fallbackText={getInitials(formData.nome || "Paciente")}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="nome" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome completo *</Label>
                        <Input
                          id="nome"
                          placeholder="Ex: Maria Oliveira Silva"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 text-base rounded-2xl text-slate-900 placeholder:text-slate-500"
                          value={formData.nome}
                          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cpf" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">CPF *</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900 placeholder:text-slate-500"
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dataNascimento" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Data de Nascimento</Label>
                        <Input
                          id="dataNascimento"
                          type="date"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900 placeholder:text-slate-500"
                          value={formData.dataNascimento}
                          onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Sexo</Label>
                        <Select 
                          value={formData.sexo} 
                          onValueChange={(value: any) => setFormData({ ...formData, sexo: value })}
                        >
                          <SelectTrigger className="bg-white/50 border-white/50 focus:bg-white h-12 rounded-2xl text-slate-900">
                            <SelectValue placeholder="Selecione o sexo" className="text-slate-900" />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/20">
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Feminino">Feminino</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Verificado</Label>
                        <Select 
                          value={formData.verificado ? "Sim" : "Não"} 
                          onValueChange={(value) => setFormData({ ...formData, verificado: value === "Sim" })}
                        >
                          <SelectTrigger className="bg-white/50 border-white/50 focus:bg-white h-12 rounded-2xl text-slate-900">
                            <SelectValue placeholder="Status de verificação" className="text-slate-900" />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/20">
                            <SelectItem value="Sim">Sim (Documentado)</SelectItem>
                            <SelectItem value="Não">Não (Pendente)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telefone" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Telefone</Label>
                        <Input
                          id="telefone"
                          placeholder="(00) 00000-0000"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900 placeholder:text-slate-500"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="paciente@exemplo.com"
                          className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900 placeholder:text-slate-500"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="prontuario" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl hover:bg-primary/10 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Laudos e Exames</h4>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">0 Documentos encontrados</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl hover:bg-orange-100/50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <Receipt className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Prescrições</h4>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">0 Itens registrados</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl hover:bg-emerald-100/50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <ClipboardList className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Anamneses</h4>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">0 Históricos disponíveis</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-purple-50 border border-purple-100 rounded-3xl hover:bg-purple-100/50 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                            <ScrollText className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Receitas</h4>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">0 Guias emitidas</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-12 text-center bg-white/30 rounded-[2.5rem] border-2 border-dashed border-white/50">
                      <div className="h-20 w-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mx-auto mb-6">
                        <Users className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                      <h5 className="text-lg font-black text-slate-800 mb-2">Prontuário Vazio</h5>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Os dados clínicos serão preenchidos automaticamente durante os atendimentos médicos no consultório.
                      </p>
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
                {isLoading ? "Salvando..." : "Finalizar Cadastro"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}