import { useState, useRef, useCallback, useEffect } from "react";
import SpaceBackground from "@/components/SpaceBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import ConnectionDrawer from "@/components/ConnectionDrawer";
import PublisherPage from "@/components/PublisherPage";
import LoginPage from "@/components/LoginPage";
import { useAuth } from "@/hooks/useAuth";
import { fbApi, saveCreds, loadCreds, clearCreds } from "@/lib/facebook-api";

type Page = "home" | "app" | "login";

const Index = () => {
  const { session, loading: authLoading, signOut } = useAuth();
  const [page, setPage] = useState<Page>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<{ token: string; c_user: string; xs: string } | null>(null);
  const [savedCreds, setSavedCreds] = useState<{ t: string; c: string; x: string } | null>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const creds = loadCreds();
    if (creds) setSavedCreds(creds);
  }, []);

  const handleConnect = useCallback(async (token: string, cUser: string, xs: string) => {
    setConnectLoading(true);
    setConnectError("");
    try {
      const data = await fbApi({ action: "connect", token, c_user: cUser, xs });
      if (!data?.success) {
        setConnectError(data?.error || "Connection failed");
        setConnectLoading(false);
        return;
      }
      setConnected(true);
      setUserName(data.user_name || "User");
      setAdAccounts(data.ad_accounts || []);
      setPages(data.pages || []);
      setCredentials({ token, c_user: cUser, xs });
      saveCreds(token, cUser, xs);
      setDrawerOpen(false);
    } catch (e: any) {
      setConnectError(`Network error: ${e.message}`);
    }
    setConnectLoading(false);
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnected(false);
    setUserName("");
    setAdAccounts([]);
    setPages([]);
    setCredentials(null);
    setSavedCreds(null);
    clearCreds();
  }, []);

  const handleLaunch = useCallback(() => {
    if (!session) {
      setPage("login");
    } else {
      setPage("app");
    }
    window.scrollTo(0, 0);
  }, [session]);

  const navigate = useCallback((p: Page) => {
    if (p === "app" && !session) {
      setPage("login");
      window.scrollTo(0, 0);
      return;
    }
    setPage(p);
    window.scrollTo(0, 0);
  }, [session]);

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--background))" }}>
        <div className="w-6 h-6 border-2 rounded-full animate-spin-slow" style={{ borderColor: "hsl(var(--brand-dim))", borderTopColor: "hsl(var(--brand))" }} />
      </div>
    );
  }

  // Login page
  if (page === "login" && !session) {
    return (
      <LoginPage onLogin={() => setPage("app")} onBack={() => setPage("home")} />
    );
  }

  // If user just logged in from login page, redirect to app
  if (page === "login" && session) {
    setPage("app");
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SpaceBackground />
      <Navbar
        connected={connected}
        userName={userName}
        onConnect={() => { setPage("app"); setDrawerOpen(true); }}
        onNavigate={navigate}
        currentPage={page === "login" ? "home" : page}
        onSignOut={session ? signOut : undefined}
        userEmail={session?.user.email}
        onLogin={() => setPage("login")}
        isLoggedIn={!!session}
      />

      {page === "home" ? (
        <div className="pt-16 relative z-[1]">
          <HeroSection onLaunch={handleLaunch} onExplore={() => featuresRef.current?.scrollIntoView({ behavior: "smooth" })} />
          <StatsSection />
          <FeaturesSection ref={featuresRef} />
          <CTASection onLaunch={handleLaunch} />
        </div>
      ) : page === "app" ? (
        <div className="relative z-[1]">
          <PublisherPage
            connected={connected}
            onOpenDrawer={() => setDrawerOpen(true)}
            adAccounts={adAccounts}
            pages={pages}
            credentials={credentials}
          />
        </div>
      ) : null}

      <ConnectionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        connected={connected}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        loading={connectLoading}
        error={connectError}
        savedCreds={savedCreds}
      />
    </div>
  );
};

export default Index;
