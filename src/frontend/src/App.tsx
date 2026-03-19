import { Toaster } from "@/components/ui/sonner";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import type { SearchParams } from "./components/SearchBar";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import AboutUsPage from "./pages/AboutUsPage";
import HomePage from "./pages/HomePage";
import JournalsPage from "./pages/JournalsPage";
import ManuscriptManagementPage from "./pages/ManuscriptManagementPage";
import MySubmissionsPage from "./pages/MySubmissionsPage";
import PaperStatusPage from "./pages/PaperStatusPage";
import SearchPage from "./pages/SearchPage";
import SubmitManuscriptPage from "./pages/SubmitManuscriptPage";

export type Page =
  | "home"
  | "journals"
  | "submit"
  | "about"
  | "status"
  | "my-submissions"
  | "manage"
  | "search";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0B2C45] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
          <BookOpen className="w-7 h-7 text-white animate-pulse" />
        </div>
        <p className="text-white/60 text-sm">Loading RKNO WEB...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    category: "",
    year: "",
  });
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setCurrentPage("search");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} onSearch={handleSearch} />;
      case "journals":
        return <JournalsPage />;
      case "submit":
        return <SubmitManuscriptPage />;
      case "about":
        return <AboutUsPage />;
      case "status":
        return <PaperStatusPage />;
      case "search":
        return <SearchPage params={searchParams} onSearch={handleSearch} />;
      case "my-submissions":
        return identity ? (
          <MySubmissionsPage />
        ) : (
          <HomePage onNavigate={setCurrentPage} onSearch={handleSearch} />
        );
      case "manage":
        return isAdmin ? (
          <ManuscriptManagementPage />
        ) : (
          <HomePage onNavigate={setCurrentPage} onSearch={handleSearch} />
        );
      default:
        return <HomePage onNavigate={setCurrentPage} onSearch={handleSearch} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col">
      <NavBar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onSearch={handleSearch}
        isLoggedIn={!!identity}
        isAdmin={!!isAdmin}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default function App() {
  const { isInitializing } = useInternetIdentity();

  if (isInitializing) return <LoadingScreen />;

  return (
    <>
      <AppContent />
      <Toaster richColors position="top-right" />
    </>
  );
}
