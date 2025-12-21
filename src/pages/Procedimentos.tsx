import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable } from "@/components/dashboard/DataTable";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ClipboardList, Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Procedimento {
  id: string;
  codigoCbhpm: string;
  nome: string;
  descricao: string;
}

const initialProcedimentos: Procedimento[] = [
  {
    id: "1",
    codigoCbhpm: "10101012",
    nome: "Consulta em consultório",
    descricao: "Consulta médica em consultório (no horário normal ou preestabelecido)",
  },
  {
    id: "2",
    codigoCbhpm: "40301010",
    nome: "Eletrocardiograma",
    descricao: "ECG convencional de até 12 derivações",
  },
  {
    id: "3",
    codigoCbhpm: "40808041",
    nome: "Ultrassonografia de abdome total",
    descricao: "Ultrassonografia de abdome total (fígado, vias biliares, vesícula, pâncreas, baço e grandes vasos)",
  },
];

export default function Procedimentos() {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>(initialProcedimentos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProcedimento, setEditingProcedimento] = useState<Procedimento | null>(null);
  const [formData, setFormData] = useState({
    codigoCbhpm: "",
    nome: "",
    descricao: "",
  });
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState(""); // Novo estado para o termo de busca

  const handleOpenModal = (procedimento?: Procedimento) => {
    if (procedimento) {
      setEditingProcedimento(procedimento);
      setFormData({
        codigoCbhpm: procedimento.codigoCbhpm,
        nome: procedimento.nome,
        descricao: procedimento.descricao,
      });
    } else {
      setEditingProcedimento(null);
      setFormData({ codigoCbhpm: "", nome: "", descricao: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProcedimento(null);
    setFormData({ codigoCbhpm: "", nome: "", descricao: "" });
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.codigoCbhpm) {
      toast({
        variant: "destructive",
        title: "❌ Erro ao salvar",
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingProcedimento) {
      setProcedimentos(procedimentos.map((p) => 
        p.id === editingProcedimento.id ? { ...p, ...formData } : p
      ));
      toast({
        title: "✅ Procedimento atualizado com sucesso!",
        description: `${formData.nome} foi atualizado no sistema.`,
      });
    } else {
      const newProcedimento: Procedimento = {
        id: Date.now().toString(),
        ...formData,
      };
      setProcedimentos([...procedimentos, newProcedimento]);
      toast({
        title: "✅ Procedimento cadastrado com sucesso!",
        description: `${formData.nome} foi adicionado ao sistema.`,
      });
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    const procedimento = procedimentos.find((p) => p.id === id);
    setProcedimentos(procedimentos.filter((p) => p.id !== id));
    toast({
      title: "✅ Procedimento removido",
      description: `${procedimento?.nome} foi removido do sistema.`,
    });
  };

  // Filtrar procedimentos com base no termo de busca
  const filteredProcedimentos = procedimentos.filter((procedimento) =>
    procedimento.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "codigoCbhpm" as const, label: "Código CBHPM" },
    { key: "nome" as const, label: "Nome" },
    { 
      key: "descricao" as const, 
      label: "Descrição",
      render: (procedimento: Procedimento) => (
        <span className="line-clamp-2 max-w-xs">{procedimento.descricao}</span>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (procedimento: Procedimento) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenModal(procedimento)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(procedimento.id)}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Procedimentos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os procedimentos cadastrados no sistema
            </p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Procedimento
          </Button>
        </div>

        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar procedimento por nome..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredProcedimentos} // Usar dados filtrados
          emptyState={
            <EmptyState
              icon={ClipboardList}
              title="Nenhum procedimento cadastrado"
              description="Clique em Novo Procedimento para começar."
              actionLabel="Novo Procedimento"
              onAction={() => handleOpenModal()}
            />
          }
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-xl max-h-[95vh] overflow-y-auto glass border-white/40 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
            <div className="bg-primary/5 p-8 border-b border-border/50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tight text-gradient">
                  {editingProcedimento ? "Editar Procedimento" : "Novo Procedimento"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Defina os detalhes do procedimento clínico.
                </p>
              </DialogHeader>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="codigoCbhpm" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Código CBHPM *</Label>
                    <Input
                      id="codigoCbhpm"
                      placeholder="00.00.00.00"
                      className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 rounded-2xl text-slate-900 placeholder:text-slate-500"
                      value={formData.codigoCbhpm}
                      onChange={(e) => setFormData({ ...formData, codigoCbhpm: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nome" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome do Procedimento *</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Consulta Médica Especializada"
                      className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 py-6 text-base rounded-2xl text-slate-900 placeholder:text-slate-500"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descricao" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Descrição</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva detalhes importantes deste procedimento..."
                      className="bg-white/50 border-white/50 focus:bg-white transition-all duration-300 rounded-2xl min-h-[120px] text-slate-900 placeholder:text-slate-500"
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-secondary/30 flex justify-end gap-4 border-t border-border/50">
              <Button variant="ghost" onClick={handleCloseModal} className="font-bold text-slate-600 hover:bg-white hover:text-slate-900 rounded-2xl h-12 px-6">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isLoading} className="font-black h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                {isLoading ? "Salvando..." : "Salvar Procedimento"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}