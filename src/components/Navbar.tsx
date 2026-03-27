import { useState } from "react";
import { Flower2, Settings, Home, LogOut, LogIn } from "lucide-react";

interface NavbarProps {
  connected: boolean;
  userName: string;
  onConnect: () => void;
  onNavigate: (page: "home" | "app") => void;
  currentPage: "home" | "app";
  onSignOut?: () => void;
  userEmail?: string;
  onLogin?: () => void;
  isLoggedIn: boolean;
}

const Navbar = ({ connected, userName, onConnect, onNavigate, currentPage, onSignOut, userEmail, onLogin, isLoggedIn }: NavbarProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
    <nav
      className="fixed top-0 left-0 right-0 z-[100] h-16 flex items-center px-4 md:px-6"
      style={{
        background: "hsl(var(--nav-bg))",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid hsl(var(--glass-border))",
        boxShadow: "0 1px 12px hsl(335 40% 60% / 0.08)",
      }}
    >
      <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 animate-cherry-glow"
            style={{ background: "var(--grad-primary)" }}
          >
            <Flower2 className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground" style={{ fontStyle: "italic" }}>
            Twisky<span style={{ color: "hsl(var(--brand))" }}>.</span>
          </span>
          <span
            className="text-[0.5rem] font-bold px-1.5 py-0.5 rounded-full tracking-widest uppercase"
            style={{ background: "hsl(var(--brand-dim))", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand) / 0.2)" }}
          >
            PRO
          </span>
        </button>

        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
              <div className="relative flex items-center">
                <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald" : "bg-destructive"}`} style={{ background: connected ? "hsl(var(--sage))" : "hsl(var(--destructive))" }} />
                {connected && <div className="absolute w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--sage))", animation: "ring-pulse 2s ease-out infinite" }} />}
              </div>
              <span className="text-muted-foreground">{connected ? userName : "Offline"}</span>
            </div>
          )}

          {currentPage === "home" ? (
            <div className="flex items-center gap-1.5">
              {isLoggedIn ? (
                <button
                  onClick={() => onNavigate("app")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all text-white border-none btn-primary"
                >
                  <Flower2 className="w-3.5 h-3.5" /> Launch
                </button>
              ) : (
                <button
                  onClick={onLogin}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all text-white border-none btn-primary"
                >
                  <LogIn className="w-3.5 h-3.5" /> Login
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigate("home")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors hover:bg-muted border border-border bg-transparent text-muted-foreground"
              >
                <Home className="w-3.5 h-3.5" /> Home
              </button>
              <button
                onClick={onConnect}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all text-white border-none btn-primary"
              >
                <Settings className="w-3.5 h-3.5" /> {connected ? "Settings" : "Connect"}
              </button>
            </div>
          )}

          {onSignOut && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors hover:bg-destructive/10 border border-border bg-transparent text-muted-foreground"
              title={userEmail || "Sign out"}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </nav>

    {showLogoutConfirm && (
      <>
        <div
          className="fixed inset-0 z-[300] transition-opacity"
          style={{ background: "hsl(var(--overlay))", backdropFilter: "blur(4px)" }}
          onClick={() => setShowLogoutConfirm(false)}
        />
        <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
          <div
            className="w-full max-w-[340px] rounded-3xl p-6 flex flex-col items-center gap-4 animate-scale-in"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "hsl(var(--destructive) / 0.08)", border: "1px solid hsl(var(--destructive) / 0.15)" }}
            >
              <LogOut className="w-5 h-5" style={{ color: "hsl(var(--destructive))" }} />
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-base text-foreground" style={{ fontStyle: "italic" }}>Sign Out?</h3>
              <p className="text-[0.7rem] text-muted-foreground mt-1">Are you sure you want to sign out of your account?</p>
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-colors hover:bg-muted border border-border bg-transparent text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); onSignOut!(); }}
                className="flex-1 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all border-none text-white"
                style={{ background: "hsl(var(--destructive))" }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
};

export default Navbar;
