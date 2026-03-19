import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";
import { useState } from "react";
import { JOURNAL_CATEGORIES, MOCK_JOURNALS } from "../lib/constants";

export default function JournalsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filtered = MOCK_JOURNALS.filter((j) => {
    const matchSearch =
      !search ||
      j.name.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || j.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">
          Browse Journals
        </h1>
        <p className="text-[#6B7280]">
          Explore our peer-reviewed journals across all academic disciplines.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            placeholder="Search journals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !selectedCategory
                ? "bg-[#0B2C45] text-white"
                : "bg-[#F2F4F7] text-[#6B7280] hover:bg-[#E5E7EB]"
            }`}
          >
            All
          </button>
          {JOURNAL_CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                setSelectedCategory(cat === selectedCategory ? "" : cat)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-[#0B2C45] text-white"
                  : "bg-[#F2F4F7] text-[#6B7280] hover:bg-[#E5E7EB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((journal) => (
          <div
            key={journal.id}
            className="bg-white border border-[#E5E7EB] rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#0B2C45] rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary" className="text-[10px]">
                {journal.frequency}
              </Badge>
            </div>
            <Badge className="w-fit text-[10px] mb-3 bg-[#E9EFF4] text-[#0B2C45] hover:bg-[#E9EFF4]">
              {journal.category}
            </Badge>
            <h3 className="font-bold text-[#111827] text-base leading-snug mb-2">
              {journal.name}
            </h3>
            <p className="text-[#6B7280] text-xs mb-1 font-medium">
              {journal.issn}
            </p>
            <p className="text-[#6B7280] text-sm leading-relaxed flex-1 mb-4">
              {journal.description}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-[#F2F4F7]">
              <span className="text-[#6B7280] text-xs">
                {journal.articlesCount} articles
              </span>
              <Button
                size="sm"
                className="bg-[#0B2C45] text-white hover:bg-[#0B2C45]/90 text-xs"
              >
                View Issues
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
          <p className="text-[#6B7280]">No journals match your search.</p>
        </div>
      )}
    </div>
  );
}
