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
import { Users, Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageInput } from "@/components/ImageInput";

interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  avatar?: string;
}

const initialPacientes: Paciente[] = [
  {
    id: "1",
    nome: "Maria Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 98888-0001",
    email: "maria@email.com",
    dataNascimento: "1985-03-15",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Maria%20Silva",
  },
  {
    id: "2",
    nome: "João Santos",
    cpf: "234.567.890-11",
    telefone: "(11) 98888-0002",
    email: "joao@email.com",
    dataNascimento: "1990-07-22",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Joao%20Santos",
  },
  {
    id: "3",
    nome: "Ana Costa",
    cpf: "345.678.901-22",
    telefone: "(11) 98888-0003",
    email: "ana@email.com",
    dataNascimento: "1978-11-08",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ana%20Costa",
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
    avatar: "",
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
        avatar: paciente.avatar || "",
      });
    } else {
      setEditingPaciente(null);
      setFormData({ nome: "", cpf: "", telefone: "", email: "", dataNascimento: "", avatar: "" });
    }
    setAvatarFile(null); // Reset avatar file
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPaciente(null);
    setFormData({ nome: "", cpf: "", telefone: "", email: "", dataNascimento: "", avatar: "" });
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
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPaciente ? "Editar Paciente" : "Novo Paciente"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <ImageInput
                label="Foto do Paciente"
                currentImage={formData.avatar}
                onImageChange={setAvatarFile}
                fallbackText={getInitials(formData.nome || "Paciente")}
              />
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo *</Label>
                <Input
                  id="nome"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}