import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calendar, FileSearch } from "lucide-react";
import type { ArticleStatus } from "../backend";
import { OpenAccessBadge } from "../components/OpenAccessBadge";
import SearchBar, { type SearchParams } from "../components/SearchBar";
import {
  ARTICLE_STATUS_COLORS,
  ARTICLE_STATUS_LABELS,
  MOCK_ARTICLES,
} from "../lib/constants";

interface SearchPageProps {
  params: SearchParams;
  onSearch: (params: SearchParams) => void;
}

export default function SearchPage({ params, onSearch }: SearchPageProps) {
  const { keyword, category, year } = params;

  const results = MOCK_ARTICLES.filter((article) => {
    const kw = keyword.trim().toLowerCase();
    const matchKeyword =
      !kw ||
      article.title.toLowerCase().includes(kw) ||
      article.abstract.toLowerCase().includes(kw) ||
      article.authors.some((a) => a.toLowerCase().includes(kw));
    const matchCategory = !category || article.category === category;
    const matchYear = !year || article.publicationDate.startsWith(year);
    return matchKeyword && matchCategory && matchYear;
  });

  const queryLabel = [
    keyword && `"${keyword}"`,
    category && `in ${category}`,
    year && `(${year})`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-ocid="search.page">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827] mb-1">
          Search Articles
        </h1>
        <p className="text-slate-500 text-sm">
          Filter published research by keyword, category, or year.
        </p>
      </div>

      {/* Refine search */}
      <div className="mb-8">
        <SearchBar onSearch={onSearch} initialParams={params} />
      </div>

      {/* Results count */}
      <div className="mb-5 flex items-center gap-2">
        <FileSearch className="w-5 h-5 text-[#0B2C45]" />
        <span className="text-[#111827] font-semibold">
          {results.length} result{results.length !== 1 ? "s" : ""}
          {queryLabel && (
            <span className="text-slate-500 font-normal ml-1">
              for {queryLabel}
            </span>
          )}
        </span>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          data-ocid="search.list"
        >
          {results.map((article, idx) => (
            <Card
              key={article.id}
              className="border border-slate-200 hover:shadow-md transition-shadow"
              data-ocid={`search.item.${idx + 1}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <Badge className="text-[10px] font-bold uppercase tracking-wide bg-[#E9EFF4] text-[#0B2C45] hover:bg-[#E9EFF4]">
                    {article.category}
                  </Badge>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      ARTICLE_STATUS_COLORS[article.status as ArticleStatus]
                    }`}
                  >
                    {ARTICLE_STATUS_LABELS[article.status as ArticleStatus]}
                  </span>
                </div>

                <h3 className="font-serif font-semibold text-[#111827] text-sm leading-snug mb-1.5 line-clamp-2">
                  {article.title}
                </h3>

                <div className="mb-2">
                  <OpenAccessBadge />
                </div>

                <p className="text-slate-500 text-xs mb-3">
                  {article.authors.join(", ")} &middot; {article.journalName}
                </p>

                <p className="font-serif text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                  {article.abstract}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.publicationDate}
                  </span>
                  <button
                    type="button"
                    className="text-[#0B2C45] text-xs font-medium hover:underline"
                  >
                    Read Abstract →
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="search.empty_state"
        >
          <BookOpen className="w-14 h-14 text-slate-300 mb-4" />
          <h3 className="font-serif text-lg font-semibold text-slate-600 mb-2">
            No articles found
          </h3>
          <p className="text-slate-400 text-sm max-w-sm">
            Try adjusting your search terms or clearing the category and year
            filters to broaden your results.
          </p>
        </div>
      )}
    </div>
  );
}
