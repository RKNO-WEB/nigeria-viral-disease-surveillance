import { BookOpen } from "lucide-react";
import type { Page } from "../App";

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0B2C45] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">RKNO WEB</div>
                <div className="text-white/50 text-[10px]">
                  Research & Knowledge Network
                </div>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Advancing knowledge through rigorous peer-reviewed research. Your
              platform for publishing and accessing cutting-edge academic
              scholarship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", page: "home" as Page },
                { label: "Browse Journals", page: "journals" as Page },
                { label: "Submit Manuscript", page: "submit" as Page },
                { label: "Check Paper Status", page: "status" as Page },
                { label: "About Us", page: "about" as Page },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => onNavigate(page)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Downloads / Info */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Paper Format Template</li>
              <li>Copyright Form</li>
              <li>Special Issue Proposal</li>
              <li>Guide for Authors</li>
              <li>Plagiarism Policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Research & Knowledge Web (RKNO WEB).
            All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/70 text-xs underline transition-colors"
          >
            Built with caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
