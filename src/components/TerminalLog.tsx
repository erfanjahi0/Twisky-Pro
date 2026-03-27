import { useRef, useEffect } from "react";

export interface LogEntry {
  id: number;
  type: "info" | "pending" | "success" | "error" | "complete";
  message: string;
  time: string;
}

const logColors: Record<string, { icon: string; color: string }> = {
  info: { icon: "ℹ", color: "hsl(var(--brand))" },
  pending: { icon: "◎", color: "hsl(var(--amber))" },
  success: { icon: "✓", color: "hsl(var(--sage))" },
  error: { icon: "✕", color: "hsl(var(--destructive))" },
  complete: { icon: "✿", color: "hsl(var(--brand))" },
};

const TerminalLog = ({ logs, onClear }: { logs: LogEntry[]; onClear: () => void }) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="rounded-2xl overflow-hidden blossom-card">
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid hsl(var(--border))", background: "hsl(var(--muted))" }}>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--brand-light))" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--petal))" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(var(--cherry))" }} />
          </div>
          <span className="font-mono text-[0.65rem] text-muted-foreground">api.log</span>
        </div>
        <button onClick={onClear} className="bg-transparent border-none font-mono text-[0.6rem] cursor-pointer text-muted-foreground hover:text-foreground transition-colors">Clear</button>
      </div>

      <div
        ref={logRef}
        className="p-4 h-[200px] overflow-y-auto font-mono text-[0.7rem] leading-[1.9]"
        style={{ background: "hsl(340 20% 97%)" }}
      >
        {logs.length === 0 ? (
          <div className="text-muted-foreground/40">{"// Waiting for activity..."}</div>
        ) : (
          logs.map((log) => {
            const s = logColors[log.type] || logColors.info;
            return (
              <div key={log.id} className="flex items-start gap-2 animate-log-in">
                <span className="min-w-[48px] shrink-0 text-muted-foreground/40">[{log.time}]</span>
                <span className="shrink-0 text-[0.6rem] mt-px" style={{ color: s.color }}>{s.icon}</span>
                <span style={{ color: s.color, opacity: 0.85 }}>{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TerminalLog;
