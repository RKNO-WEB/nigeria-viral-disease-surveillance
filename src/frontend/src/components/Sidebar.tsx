import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Bell,
  ClipboardList,
  FilePlus,
  FileText,
  LayoutDashboard,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { UserRole } from "../backend";
import { useOutbreakAlerts } from "../hooks/useQueries";

export type Page =
  | "dashboard"
  | "report"
  | "my-reports"
  | "case-management"
  | "alerts"
  | "profile";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: UserRole | null | undefined;
  userName?: string;
}

const navItems = [
  {
    id: "dashboard" as Page,
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "nav.dashboard_link",
  },
  {
    id: "report" as Page,
    label: "Report Case",
    icon: FilePlus,
    ocid: "nav.report_link",
  },
  {
    id: "my-reports" as Page,
    label: "My Reports",
    icon: FileText,
    ocid: "nav.my_reports_link",
  },
  {
    id: "case-management" as Page,
    label: "Case Management",
    icon: ClipboardList,
    ocid: "nav.case_mgmt_link",
    adminOnly: true,
  },
  {
    id: "alerts" as Page,
    label: "Alerts",
    icon: Bell,
    ocid: "nav.alerts_link",
  },
  {
    id: "profile" as Page,
    label: "Profile",
    icon: User,
    ocid: "nav.profile_link",
  },
];

export default function Sidebar({
  currentPage,
  onNavigate,
  userRole,
  userName,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: alerts } = useOutbreakAlerts();
  const alertCount = alerts?.length ?? 0;

  const isAdminOrSupervisor =
    userRole === UserRole.admin || userRole === UserRole.user;
  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || isAdminOrSupervisor,
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
            <Activity className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-sidebar-foreground text-sm leading-tight">
              NVDSS
            </div>
            <div className="text-xs text-sidebar-foreground/50 leading-tight">
              Nigeria Surveillance
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={item.ocid}
              onClick={() => {
                onNavigate(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === "alerts" && alertCount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0 h-5">
                  {alertCount}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {userName && (
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/30 flex items-center justify-center">
              <span className="text-xs font-bold text-sidebar-primary">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-sidebar-foreground truncate">
                {userName}
              </div>
              <div className="text-xs text-sidebar-foreground/50 capitalize">
                {userRole ?? "guest"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden w-full cursor-default"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar z-50 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      <aside className="hidden lg:flex flex-col w-64 bg-sidebar h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
