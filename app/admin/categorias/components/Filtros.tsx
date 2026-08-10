import { Search } from "lucide-react";

interface Props {
  busqueda: string;
  setBusqueda: (valor: string) => void;
}

export default function Filtros({ busqueda, setBusqueda }: Props) {
  return (
    <div className="relative w-full sm:w-96">
      <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
      <input
        type="text"
        placeholder="Buscar por nombre o slug..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
      />
    </div>
  );
}