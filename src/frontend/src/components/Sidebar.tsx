// Sidebar is replaced by NavBar in RKNO WEB.
// This stub preserves any remaining imports.
import type { UserRole } from "../backend";

export type Page =
  | "home"
  | "journals"
  | "submit"
  | "about"
  | "status"
  | "my-submissions"
  | "manage";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: UserRole | null | undefined;
  userName?: string;
}

export default function Sidebar(_props: SidebarProps) {
  return null;
}
