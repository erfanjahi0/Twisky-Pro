import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flower2, LogIn, AlertCircle, ArrowLeft } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
  onBack?: () => void;
}

const LoginPage = ({ onLogin, onBack }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    onLogin();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute animate-blossom-pulse"
          style={{ top: "-10%", left: "-5%", width: "50vw", height: "50vw", borderRadius: "50%", background: "radial-gradient(circle, hsl(335 80% 75% / 0.14) 0%, transparent 70%)" }}
        />
        <div
          className="absolute animate-blossom-pulse"
          style={{ bottom: "-10%", right: "-5%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle, hsl(350 75% 80% / 0.12) 0%, transparent 65%)", animationDelay: "2s" }}
        />
      </div>

      <div
        className="w-full max-w-[380px] rounded-3xl p-8 flex flex-col items-center gap-6 relative z-10 animate-scale-in"
        style={{
          background: "hsl(0 0% 100%)",
          border: "1px solid hsl(var(--border))",
          boxShadow: "var(--shadow-lg), 0 0 60px hsl(335 70% 60% / 0.08)",
        }}
      >
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="self-start flex items-center gap-1.5 text-[0.7rem] text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" /> Back to home
          </button>
        )}

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center animate-cherry-glow"
            style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-petal)" }}
          >
            <Flower2 className="w-7 h-7 text-white" fill="currentColor" />
          </div>
          <div className="text-center">
            <h1
              className="font-display font-bold text-2xl text-foreground"
              style={{ fontStyle: "italic" }}
            >
              Twisky<span style={{ color: "hsl(var(--brand))" }}>.</span>
              <span
                className="ml-1.5 text-[0.5rem] font-bold px-1.5 py-0.5 rounded-full tracking-widest uppercase align-middle"
                style={{ background: "hsl(var(--brand-dim))", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand) / 0.2)", fontStyle: "normal" }}
              >
                PRO
              </span>
            </h1>
            <p className="text-[0.7rem] text-muted-foreground mt-1">Sign in to access the dashboard</p>
          </div>
        </div>

        {/* Decorative petals */}
        <div className="flex gap-2 text-lg animate-float" style={{ marginTop: "-8px" }}>
          <span>🌸</span><span style={{ animationDelay: "0.4s" }}>🌺</span><span style={{ animationDelay: "0.8s" }}>🌷</span>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
          <div>
            <label className="text-[0.65rem] font-semibold text-muted-foreground mb-1.5 block uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="premium-input"
              required
            />
          </div>
          <div>
            <label className="text-[0.65rem] font-semibold text-muted-foreground mb-1.5 block uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="premium-input"
              required
            />
          </div>

          {error && (
            <div
              className="p-2.5 rounded-xl text-[0.7rem] flex items-center gap-2"
              style={{
                background: "hsl(var(--destructive) / 0.05)",
                border: "1px solid hsl(var(--destructive) / 0.15)",
                color: "hsl(var(--destructive))",
              }}
            >
              <AlertCircle className="w-3 h-3 shrink-0" /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full py-3.5 rounded-2xl border-none text-white text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-2 btn-primary"
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
            ) : (
              <LogIn className="w-3.5 h-3.5" />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-[0.6rem] text-muted-foreground text-center">
          Contact administrator for account access
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
