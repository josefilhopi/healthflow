import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  emptyState,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="glass rounded-[2rem] shadow-card overflow-hidden border-white/40">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="h-16 px-6 uppercase text-[10px] tracking-widest font-black">{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i} className="border-b border-border/30 last:border-0">
                {columns.map((column) => (
                  <TableCell key={String(column.key)} className="px-6 py-6">
                    <Skeleton className="h-5 w-full max-w-[150px] bg-primary/5 rounded-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <div className="bg-card rounded-xl shadow-card">{emptyState}</div>;
  }

  return (
    <div className="glass rounded-[2rem] shadow-2xl border-white/40 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-b border-border/50">
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="font-extrabold text-foreground h-16 px-6 uppercase text-[10px] tracking-widest">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-primary/5 transition-all duration-300 border-b border-border/30 last:border-0 group">
                {columns.map((column) => (
                  <TableCell key={String(column.key)} className="px-6 py-6 text-sm font-medium text-muted-foreground group-hover:text-foreground">
                    {column.render
                      ? column.render(item)
                      : String(item[column.key as keyof T] || "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
