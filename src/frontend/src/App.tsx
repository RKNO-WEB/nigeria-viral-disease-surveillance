import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Activity, Loader2, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Sidebar, { type Page } from "./components/Sidebar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile, useUserRole } from "./hooks/useQueries";
import Alerts from "./pages/Alerts";
import CaseManagement from "./pages/CaseManagement";
import Dashboard from "./pages/Dashboard";
import MyReports from "./pages/MyReports";
import Profile from "./pages/Profile";
import ReportCase from "./pages/ReportCase";

function LandingPage() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-sidebar flex flex-col">
      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <span className="font-display font-bold text-sidebar-foreground">
              NVDSS
            </span>
            <span className="text-sidebar-foreground/50 text-sm ml-2">
              Nigeria Viral Disease Surveillance System
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground/70 text-xs font-medium mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sidebar-primary animate-pulse" />
              Powered by Internet Computer · Tamperproof & Decentralized
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-sidebar-foreground leading-tight">
              Nigeria Viral Disease
              <br />
              Surveillance System
            </h1>
            <p className="text-sidebar-foreground/60 text-lg max-w-lg mx-auto leading-relaxed">
              A tamperproof, real-time epidemiological surveillance platform for
              Nigerian health workers — built on the Internet Computer Protocol
              for permanent, sovereign data storage.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 px-8"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              data-ocid="landing.primary_button"
            >
              {(isLoggingIn || isInitializing) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In with Internet Identity
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
          >
            {[
              {
                icon: "🛡️",
                title: "Tamperproof",
                desc: "Data secured on ICP blockchain — immutable and verifiable",
              },
              {
                icon: "📊",
                title: "Real-time Analytics",
                desc: "Live outbreak dashboards by time, place, and person",
              },
              {
                icon: "🌍",
                title: "WHO Standards",
                desc: "Standardized case definitions aligned with WHO protocols",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="p-4 rounded-xl bg-sidebar-accent/60 border border-sidebar-border text-left"
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-display font-semibold text-sidebar-foreground text-sm">
                  {title}
                </div>
                <div className="text-xs text-sidebar-foreground/50 mt-1 leading-relaxed">
                  {desc}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      <footer className="px-8 py-4 border-t border-sidebar-border text-center text-xs text-sidebar-foreground/40">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-sidebar-foreground/70"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

function AppShell() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const { clear, identity } = useInternetIdentity();
  const { data: role } = useUserRole();
  const { data: profile } = useUserProfile();

  const handleNavigate = (page: Page) => setCurrentPage(page);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "report":
        return <ReportCase onSuccess={() => setCurrentPage("my-reports")} />;
      case "my-reports":
        return <MyReports />;
      case "case-management":
        return <CaseManagement />;
      case "alerts":
        return <Alerts />;
      case "profile":
        return <Profile />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        userRole={role}
        userName={profile?.name}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card flex-shrink-0">
          <div className="flex items-center gap-2 lg:hidden" />
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              {identity?.getPrincipal().toString().slice(0, 24)}…
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-destructive"
              data-ocid="nav.logout_button"
            >
              <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-6 py-3 border-t border-border text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-sidebar flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Activity className="w-6 h-6 text-sidebar-primary-foreground animate-pulse" />
          </div>
          <p className="text-sidebar-foreground/60 text-sm">Loading NVDSS…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {identity ? <AppShell /> : <LandingPage />}
      <Toaster richColors position="top-right" />
    </>
  );
}
