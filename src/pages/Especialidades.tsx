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
import { Award, Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export interface Especialidade {
  id: string;
  nome: string;
  cbo: string;
}

const initialEspecialidades: Especialidade[] = [
  { id: "1", nome: "Cardiologia", cbo: "2251-20" },
  { id: "2", nome: "Dermatologia", cbo: "2251-35" },
  { id: "3", nome: "Ortopedia", cbo: "2252-70" },
  { id: "4", nome: "Pediatria", cbo: "2251-25" },
];

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>(initialEspecialidades);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEspecialidade, setEditingEspecialidade] = useState<Especialidade | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cbo: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = (especialidade?: Especialidade) => {
    if (especialidade) {
      setEditingEspecialidade(especialidade);
      setFormData({
        nome: especialidade.nome,
        cbo: especialidade.cbo,
      });
    } else {
      setEditingEspecialidade(null);
      setFormData({ nome: "", cbo: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEspecialidade(null);
    setFormData({ nome: "", cbo: "" });
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.cbo) {
      toast.error("Erro ao salvar", {
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingEspecialidade) {
      setEspecialidades(especialidades.map((e) => 
        e.id === editingEspecialidade.id ? { ...e, ...formData } : e
      ));
      toast.success("Especialidade atualizada com sucesso!");
    } else {
      const newEspecialidade: Especialidade = {
        id: Date.now().toString(),
        ...formData,
      };
      setEspecialidades([...especialidades, newEspecialidade]);
      toast.success("Especialidade cadastrada com sucesso!");
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const especialidade = especialidades.find((e) => e.id === id);
    setEspecialidades(especialidades.filter((e) => e.id !== id));
    toast.info("Especialidade removida", {
      description: `${especialidade?.nome} foi removida do sistema.`,
    });
  };

  const filteredEspecialidades = especialidades.filter((e) =>
    e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.cbo.includes(searchTerm)
  );

  const columns = [
    { key: "nome" as const, label: "Especialidade" },
    { key: "cbo" as const, label: "Código CBO" },
    {
      key: "actions",
      label: "Ações",
      render: (especialidade: Especialidade) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenModal(especialidade)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(especialidade.id)}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-black tracking-tight">Especialidades Médicas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as especialidades e seus respectivos códigos CBO.
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="font-bold rounded-2xl h-11 px-6 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            Nova Especialidade
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou CBO..."
            className="pl-9 h-12 bg-white/50 border-white/40 rounded-2xl focus:bg-white transition-all text-slate-900 placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredEspecialidades}
          emptyState={
            <EmptyState
              icon={Award}
              title="Nenhuma especialidade cadastrada"
              description="Cadastre as especialidades para vincular aos médicos."
              actionLabel="Nova Especialidade"
              onAction={() => handleOpenModal()}
            />
          }
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md glass border-white/40 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
            <div className="bg-primary/5 p-8 border-b border-border/50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight text-gradient">
                  {editingEspecialidade ? "Editar Especialidade" : "Nova Especialidade"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Insira o nome e o código CBO da especialidade.
                </p>
              </DialogHeader>
            </div>

            <div className="p-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome da Especialidade *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Cardiologia"
                  className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 text-base rounded-2xl text-slate-900 placeholder:text-slate-500"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cbo" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Código CBO *</Label>
                <Input
                  id="cbo"
                  placeholder="0000-00"
                  className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 text-base rounded-2xl text-slate-900 placeholder:text-slate-500"
                  value={formData.cbo}
                  onChange={(e) => setFormData({ ...formData, cbo: e.target.value })}
                />
              </div>
            </div>

            <div className="p-8 bg-secondary/30 flex justify-end gap-4 border-t border-border/50">
              <Button variant="ghost" onClick={handleCloseModal} className="font-bold text-slate-600 hover:bg-white hover:text-slate-900 rounded-2xl h-12 px-6">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isLoading} className="font-black h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                {isLoading ? "Salvando..." : "Confirmar Especialidade"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
