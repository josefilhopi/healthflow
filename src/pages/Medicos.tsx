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
import { Stethoscope, Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageInput } from "@/components/ImageInput";

interface Medico {
  id: string;
  nome: string;
  especialidade: string;
  crm: string;
  telefone: string;
  email: string;
  avatar?: string;
}

const initialMedicos: Medico[] = [
  {
    id: "1",
    nome: "Dr. Carlos Santos",
    especialidade: "Cardiologia",
    crm: "12345-SP",
    telefone: "(11) 99999-0001",
    email: "carlos@email.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Carlos%20Santos",
  },
  {
    id: "2",
    nome: "Dra. Ana Paula",
    especialidade: "Dermatologia",
    crm: "23456-SP",
    telefone: "(11) 99999-0002",
    email: "ana@email.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Ana%20Paula",
  },
  {
    id: "3",
    nome: "Dr. Roberto Lima",
    especialidade: "Ortopedia",
    crm: "34567-SP",
    telefone: "(11) 99999-0003",
    email: "roberto@email.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Roberto%20Lima",
  },
];

export default function Medicos() {
  const [medicos, setMedicos] = useState<Medico[]>(initialMedicos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMedico, setEditingMedico] = useState<Medico | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    especialidade: "",
    crm: "",
    telefone: "",
    email: "",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Novo estado para o termo de busca
  
  const handleOpenModal = (medico?: Medico) => {
    if (medico) {
      setEditingMedico(medico);
      setFormData({
        nome: medico.nome,
        especialidade: medico.especialidade,
        crm: medico.crm,
        telefone: medico.telefone,
        email: medico.email,
        avatar: medico.avatar || "",
      });
    } else {
      setEditingMedico(null);
      setFormData({ nome: "", especialidade: "", crm: "", telefone: "", email: "", avatar: "" });
    }
    setAvatarFile(null); // Reset avatar file
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedico(null);
    setFormData({ nome: "", especialidade: "", crm: "", telefone: "", email: "", avatar: "" });
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
    { key: "especialidade" as const, label: "Especialidade" },
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar médico por nome..."
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
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMedico ? "Editar Médico" : "Novo Médico"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <ImageInput
                label="Foto do Médico"
                currentImage={formData.avatar}
                onImageChange={setAvatarFile}
                fallbackText={getInitials(formData.nome || "Médico")}
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
                <Label htmlFor="crm">CRM *</Label>
                <Input
                  id="crm"
                  placeholder="CRM"
                  value={formData.crm}
                  onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  placeholder="Especialidade"
                  value={formData.especialidade}
                  onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="Telefone"
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