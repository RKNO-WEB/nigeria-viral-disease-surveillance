import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, LogOut, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import type { SearchParams } from "./SearchBar";

interface NavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onSearch: (params: SearchParams) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const navLinks: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "journals", label: "Journals" },
  { id: "submit", label: "Submit Manuscript" },
  { id: "status", label: "Check Paper Status" },
  { id: "about", label: "About Us" },
];

export default function NavBar({
  currentPage,
  onNavigate,
  onSearch,
  isLoggedIn,
  isAdmin,
}: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, isLoggingIn } = useInternetIdentity();

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const handleSearchClick = () => {
    onSearch({ keyword: "", category: "", year: "" });
    setMobileOpen(false);
  };

  return (
    <header className="bg-[#0B2C45] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav("home")}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-tight">
                RKNO WEB
              </div>
              <div className="text-white/50 text-[10px] leading-tight">
                Research &amp; Knowledge Network
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNav(link.id)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === link.id
                    ? "text-white bg-white/15"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => handleNav("my-submissions")}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === "my-submissions"
                    ? "text-white bg-white/15"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                data-ocid="nav.link"
              >
                My Submissions
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNav("manage")}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === "manage"
                    ? "text-white bg-white/15"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                data-ocid="nav.link"
              >
                Manage
              </button>
            )}
            {/* Search icon */}
            <button
              type="button"
              onClick={handleSearchClick}
              aria-label="Search articles"
              className={`p-2 rounded transition-colors ${
                currentPage === "search"
                  ? "text-white bg-white/15"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              data-ocid="nav.search_input"
            >
              <Search className="w-4 h-4" />
            </button>
          </nav>

          {/* Auth Button */}
          <div className="hidden lg:flex items-center gap-2">
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="text-white/70 hover:text-white hover:bg-white/10 border border-white/20"
              >
                <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="bg-white text-[#0B2C45] hover:bg-white/90 font-semibold"
              >
                <LogIn className="w-4 h-4 mr-1.5" /> Login / Register
              </Button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded text-white/70 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0B2C45] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNav(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                currentPage === link.id
                  ? "text-white bg-white/15"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </button>
          ))}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => handleNav("my-submissions")}
              className="w-full text-left px-3 py-2.5 rounded text-sm font-medium text-white/70 hover:text-white hover:bg-white/10"
              data-ocid="nav.link"
            >
              My Submissions
            </button>
          )}
          <button
            type="button"
            onClick={handleSearchClick}
            className="w-full text-left px-3 py-2.5 rounded text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2"
            data-ocid="nav.search_input"
          >
            <Search className="w-4 h-4" /> Search Articles
          </button>
          <div className="pt-2">
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="w-full text-white/70"
              >
                <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                className="w-full bg-white text-[#0B2C45] font-semibold"
              >
                <LogIn className="w-4 h-4 mr-1.5" /> Login / Register
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
