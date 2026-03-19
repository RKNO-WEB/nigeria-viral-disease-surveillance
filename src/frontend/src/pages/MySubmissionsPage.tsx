import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";
import type { ArticleStatus } from "../backend";
import { useArticles } from "../hooks/useQueries";
import { ARTICLE_STATUS_COLORS, ARTICLE_STATUS_LABELS } from "../lib/constants";

export default function MySubmissionsPage() {
  const { data: articles, isLoading } = useArticles();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#111827] mb-2">My Submissions</h1>
      <p className="text-[#6B7280] mb-8">
        Track the status of your submitted manuscripts.
      </p>

      {isLoading ? (
        <div className="text-center py-16 text-[#6B7280]">
          Loading submissions...
        </div>
      ) : !articles || articles.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
          <p className="text-[#111827] font-medium mb-1">No submissions yet</p>
          <p className="text-[#6B7280] text-sm">
            Your submitted manuscripts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id.toString()}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                      {article.category}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {article.journalName}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[#111827] mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm mb-3 line-clamp-2">
                    {article.abstract}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-[#9CA3AF]">
                    <span>Authors: {article.authors.join(", ")}</span>
                    {article.publicationDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(
                          Number(article.publicationDate) / 1_000_000,
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 ${
                    ARTICLE_STATUS_COLORS[article.status as ArticleStatus]
                  }`}
                >
                  {ARTICLE_STATUS_LABELS[article.status as ArticleStatus]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
