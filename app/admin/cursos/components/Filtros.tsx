import { Search, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { CategoriaBasica } from "../../cursos/types";

interface Props {
  busqueda: string;
  setBusqueda: (val: string) => void;
  filtroCategoria: string;
  setFiltroCategoria: (val: string) => void;
  filtroPublicado: string;
  setFiltroPublicado: (val: string) => void;
  categorias: CategoriaBasica[];
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
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

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-full sm:w-48">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between bg-white border border-slate-300 text-sm font-semibold text-slate-700 py-2 px-3.5 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer"
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown size={16} className={`transition ${abierto ? "rotate-180 text-orange-500" : "text-slate-400"}`} />
      </button>
      {abierto && (
        <div className="absolute right-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setAbierto(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-semibold transition cursor-pointer ${
                value === opt.value ? "bg-orange-50 text-orange-700" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.label}
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
  filtroPublicado,
  setFiltroPublicado,
  categorias,
}: Props) {
  const categoriaOptions = [
    { value: "TODOS", label: "Todas las categorías" },
    ...categorias.map((c) => ({ value: c.id, label: c.nombre })),
  ];

  const publicadoOptions = [
    { value: "TODOS", label: "Todos los estados" },
    { value: "true", label: "Publicado" },
    { value: "false", label: "No publicado" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar por título o slug..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
      </div>
      <CustomSelect
        value={filtroCategoria}
        onChange={setFiltroCategoria}
        options={categoriaOptions}
        placeholder="Categoría"
      />
      <CustomSelect
        value={filtroPublicado}
        onChange={setFiltroPublicado}
        options={publicadoOptions}
        placeholder="Estado"
      />
    </div>
  );
}