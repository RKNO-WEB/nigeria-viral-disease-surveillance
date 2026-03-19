import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ArticleStatus } from "../backend";
import { useArticles, useUpdatePaperStatus } from "../hooks/useQueries";
import { ARTICLE_STATUS_COLORS, ARTICLE_STATUS_LABELS } from "../lib/constants";

export default function ManuscriptManagementPage() {
  const { data: articles, isLoading } = useArticles();
  const { mutate: updateStatus, isPending } = useUpdatePaperStatus();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#111827] mb-2">
        Manuscript Management
      </h1>
      <p className="text-[#6B7280] mb-8">
        Review and manage submitted manuscripts.
      </p>

      {isLoading ? (
        <div className="text-center py-16 text-[#6B7280]">
          Loading manuscripts...
        </div>
      ) : !articles || articles.length === 0 ? (
        <div className="text-center py-16 text-[#6B7280]">
          No manuscripts submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div
              key={article.id.toString()}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                      {article.category}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {article.journalName}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-[#111827] mb-1 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm">
                    {article.authors.join(", ")}
                  </p>
                  <p className="text-[#9CA3AF] text-xs mt-1">
                    Paper ID: #{article.id.toString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      ARTICLE_STATUS_COLORS[article.status as ArticleStatus]
                    }`}
                  >
                    {ARTICLE_STATUS_LABELS[article.status as ArticleStatus]}
                  </span>
                  {article.status !== ArticleStatus.published && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatus({
                          paperId: article.id,
                          status: ArticleStatus.published,
                        })
                      }
                      disabled={isPending}
                      className="bg-green-600 text-white hover:bg-green-700 text-xs"
                    >
                      {isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Accept & Publish"
                      )}
                    </Button>
                  )}
                  {article.status === ArticleStatus.underReview && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStatus({
                          paperId: article.id,
                          status: ArticleStatus.rejected,
                        })
                      }
                      disabled={isPending}
                      className="border-red-300 text-red-600 hover:bg-red-50 text-xs"
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
