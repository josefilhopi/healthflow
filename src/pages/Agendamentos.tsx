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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Agendamento {
  id: string;
  paciente: string;
  medico: string;
  data: string;
  horario: string;
  status: "agendado" | "confirmado" | "cancelado" | "concluido";
}

const initialAgendamentos: Agendamento[] = [
  {
    id: "1",
    paciente: "Maria Silva",
    medico: "Dr. Carlos Santos",
    data: "2024-12-20",
    horario: "09:00",
    status: "confirmado",
  },
  {
    id: "2",
    paciente: "João Santos",
    medico: "Dra. Ana Paula",
    data: "2024-12-20",
    horario: "10:30",
    status: "agendado",
  },
  {
    id: "3",
    paciente: "Ana Costa",
    medico: "Dr. Roberto Lima",
    data: "2024-12-21",
    horario: "14:00",
    status: "agendado",
  },
];

const statusConfig = {
  agendado: { label: "Agendado", className: "bg-warning/20 text-warning border-warning/30" },
  confirmado: { label: "Confirmado", className: "bg-success/20 text-success border-success/30" },
  cancelado: { label: "Cancelado", className: "bg-destructive/20 text-destructive border-destructive/30" },
  concluido: { label: "Concluído", className: "bg-primary/20 text-primary border-primary/30" },
};

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(initialAgendamentos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState<Agendamento | null>(null);
  const [formData, setFormData] = useState({
    paciente: "",
    medico: "",
    data: "",
    horario: "",
    status: "agendado" as Agendamento["status"],
  });
  const { toast } = useToast();

  const handleOpenModal = (agendamento?: Agendamento) => {
    if (agendamento) {
      setEditingAgendamento(agendamento);
      setFormData({
        paciente: agendamento.paciente,
        medico: agendamento.medico,
        data: agendamento.data,
        horario: agendamento.horario,
        status: agendamento.status,
      });
    } else {
      setEditingAgendamento(null);
      setFormData({ paciente: "", medico: "", data: "", horario: "", status: "agendado" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAgendamento(null);
    setFormData({ paciente: "", medico: "", data: "", horario: "", status: "agendado" });
  };

  const handleSave = async () => {
    if (!formData.paciente || !formData.medico || !formData.data || !formData.horario) {
      toast({
        variant: "destructive",
        title: "❌ Erro ao salvar",
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingAgendamento) {
      setAgendamentos(agendamentos.map((a) => 
        a.id === editingAgendamento.id ? { ...a, ...formData } : a
      ));
      toast({
        title: "✅ Agendamento atualizado com sucesso!",
        description: "O agendamento foi atualizado no sistema.",
      });
    } else {
      const newAgendamento: Agendamento = {
        id: Date.now().toString(),
        ...formData,
      };
      setAgendamentos([...agendamentos, newAgendamento]);
      toast({
        title: "✅ Agendamento criado com sucesso!",
        description: "O agendamento foi adicionado ao sistema.",
      });
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    setAgendamentos(agendamentos.filter((a) => a.id !== id));
    toast({
      title: "✅ Agendamento removido",
      description: "O agendamento foi removido do sistema.",
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR");
  };

  const columns = [
    { key: "paciente" as const, label: "Paciente" },
    { key: "medico" as const, label: "Médico" },
    { 
      key: "data" as const, 
      label: "Data",
      render: (agendamento: Agendamento) => formatDate(agendamento.data),
    },
    { key: "horario" as const, label: "Horário" },
    {
      key: "status" as const,
      label: "Status",
      render: (agendamento: Agendamento) => {
        const config = statusConfig[agendamento.status];
        return (
          <Badge variant="outline" className={cn("font-medium", config.className)}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      label: "Ações",
      render: (agendamento: Agendamento) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenModal(agendamento)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(agendamento.id)}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os agendamentos de consultas
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={agendamentos}
          emptyState={
            <EmptyState
              icon={Calendar}
              title="Nenhum agendamento cadastrado"
              description="Clique em Novo Agendamento para começar."
              actionLabel="Novo Agendamento"
              onAction={() => handleOpenModal()}
            />
          }
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAgendamento ? "Editar Agendamento" : "Novo Agendamento"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="paciente">Nome do paciente *</Label>
                <Input
                  id="paciente"
                  placeholder="Nome do paciente"
                  value={formData.paciente}
                  onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medico">Médico *</Label>
                <Input
                  id="medico"
                  placeholder="Nome do médico"
                  value={formData.medico}
                  onChange={(e) => setFormData({ ...formData, medico: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario">Horário *</Label>
                  <Input
                    id="horario"
                    type="time"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Agendamento["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
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
