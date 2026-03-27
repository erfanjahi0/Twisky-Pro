import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Search } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  searchable?: boolean;
}

const CustomSelect = ({ options, value, onChange, placeholder = "Select...", icon, searchable = true }: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const updatePosition = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
    }
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      // Check if click is inside the portal dropdown
      const portal = document.getElementById("custom-select-portal");
      if (portal && portal.contains(e.target as Node)) return;
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      updatePosition();
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, handleClickOutside, updatePosition]);

  const showSearch = searchable && options.length > 5;

  const dropdown = open && pos ? createPortal(
    <div
      id="custom-select-portal"
      className="fixed z-[9999] rounded-2xl shadow-lg overflow-hidden"
      style={{
        top: pos.top,
        left: pos.left,
        width: pos.width,
        background: "hsl(0 0% 100%)",
        border: "1px solid hsl(var(--border))",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {showSearch && (
        <div className="p-2 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/40"
              style={{ background: "hsl(var(--input-bg))" }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      <div className="max-h-[340px] overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <div className="px-3 py-2.5 text-xs text-muted-foreground">
            {options.length === 0 ? "No options available" : "No matches found"}
          </div>
        ) : (
          filtered.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors cursor-pointer bg-transparent border-none"
              style={{
                color: opt.value === value ? "hsl(var(--brand-light))" : "hsl(var(--foreground))",
                background: opt.value === value ? "hsl(var(--brand-dim))" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = "hsl(var(--surface-hover))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = opt.value === value ? "hsl(var(--brand-dim))" : "transparent";
              }}
            >
              <span className="flex-1 truncate">{opt.label}</span>
              {opt.value === value && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="premium-select flex items-center gap-2 text-left w-full"
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className={`flex-1 truncate ${!selected ? "text-muted-foreground/50" : ""}`}>
          {selected ? selected.label : placeholder}
        </span>
      </button>
      <ChevronDown
        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none transition-transform ${open ? "rotate-180" : ""}`}
      />
      {dropdown}
    </div>
  );
};

export default CustomSelect;
