import { Search, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { CategoriaOption } from "../types";

interface Props {
  busqueda: string;
  setBusqueda: (valor: string) => void;
  filtroCategoria: string;
  setFiltroCategoria: (valor: string) => void;
  categorias: CategoriaOption[];
}

function SelectCategoria({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: CategoriaOption[];
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setAbierto(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const seleccionado =
    value === "TODOS"
      ? "Todas las categorías"
      : options.find((o) => o.id === value)?.nombre ?? "Seleccionar";

  return (
    <div ref={ref} className="relative w-full sm:w-48">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between bg-white border border-slate-300 text-sm font-semibold text-slate-700 py-2 px-3.5 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer"
      >
        <span className="truncate">{seleccionado}</span>
        <ChevronDown
          size={16}
          className={`transition ${abierto ? "rotate-180 text-orange-500" : "text-slate-400"}`}
        />
      </button>
      {abierto && (
        <div className="absolute right-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
          <button
            onClick={() => {
              onChange("TODOS");
              setAbierto(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm font-semibold transition cursor-pointer ${
              value === "TODOS"
                ? "bg-orange-50 text-orange-700"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Todas las categorías
          </button>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                onChange(opt.id);
                setAbierto(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                value === opt.id
                  ? "bg-orange-50 text-orange-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Filtros({
  busqueda,
  setBusqueda,
  filtroCategoria,
  setFiltroCategoria,
  categorias,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
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
      <SelectCategoria
        value={filtroCategoria}
        onChange={setFiltroCategoria}
        options={categorias}
      />
    </div>
  );
}