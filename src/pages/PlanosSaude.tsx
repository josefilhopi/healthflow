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
import { FileText, Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageInput } from "@/components/ImageInput";

interface PlanoSaude {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  avatar?: string;
}

const initialPlanos: PlanoSaude[] = [
  {
    id: "1",
    nome: "Unimed",
    cnpj: "12.345.678/0001-00",
    telefone: "(11) 3333-0001",
    email: "contato@unimed.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Unimed",
  },
  {
    id: "2",
    nome: "Bradesco Saúde",
    cnpj: "23.456.789/0001-11",
    telefone: "(11) 3333-0002",
    email: "contato@bradescosaude.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bradesco%20Saude",
  },
  {
    id: "3",
    nome: "Amil",
    cnpj: "34.567.890/0001-22",
    telefone: "(11) 3333-0003",
    email: "contato@amil.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Amil",
  },
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
  });
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
      });
    } else {
      setEditingPlano(null);
      setFormData({ nome: "", cnpj: "", telefone: "", email: "", avatar: "" });
    }
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlano(null);
    setFormData({ nome: "", cnpj: "", telefone: "", email: "", avatar: "" });
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlano ? "Editar Plano de Saúde" : "Novo Plano de Saúde"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <ImageInput
                label="Logo do Plano"
                currentImage={formData.avatar}
                onImageChange={setAvatarFile}
                fallbackText={getInitials(formData.nome || "Plano")}
              />
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do plano *</Label>
                <Input
                  id="nome"
                  placeholder="Nome do plano"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 0000-0000"
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