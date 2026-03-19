import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

export interface SearchParams {
  keyword: string;
  category: string;
  year: string;
}

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  initialParams?: SearchParams;
}

const CATEGORIES = [
  "All Categories",
  "Computer Science & IT",
  "Medical & Health Sciences",
  "Engineering & Technology",
  "Social Sciences",
  "Natural Sciences",
  "Environmental Sciences",
  "Business & Economics",
  "Arts & Humanities",
  "Education",
  "Mathematics & Statistics",
];

const YEARS = ["All Years", "2026", "2025", "2024", "2023", "2022"];

export default function SearchBar({ onSearch, initialParams }: SearchBarProps) {
  const [keyword, setKeyword] = useState(initialParams?.keyword ?? "");
  const [category, setCategory] = useState(initialParams?.category ?? "");
  const [year, setYear] = useState(initialParams?.year ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword, category, year });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md border border-slate-200 p-4"
      data-ocid="search.panel"
    >
      <div className="flex flex-col md:flex-row gap-3">
        {/* Keyword input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by keyword, title, or author..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-9 border-slate-200 focus:border-[#0B2C45] focus:ring-[#0B2C45] placeholder:text-slate-400 bg-slate-50"
            data-ocid="search.input"
          />
        </div>

        {/* Category dropdown */}
        <div className="w-full md:w-52">
          <Select
            value={category || "__all__"}
            onValueChange={(v) => setCategory(v === "__all__" ? "" : v)}
          >
            <SelectTrigger
              className="border-slate-200 focus:border-[#0B2C45] bg-slate-50 text-slate-700"
              data-ocid="search.select"
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat === "All Categories" ? "__all__" : cat}
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year dropdown */}
        <div className="w-full md:w-36">
          <Select
            value={year || "__all__"}
            onValueChange={(v) => setYear(v === "__all__" ? "" : v)}
          >
            <SelectTrigger
              className="border-slate-200 focus:border-[#0B2C45] bg-slate-50 text-slate-700"
              data-ocid="search.year_select"
            >
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((yr) => (
                <SelectItem
                  key={yr}
                  value={yr === "All Years" ? "__all__" : yr}
                >
                  {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search button */}
        <Button
          type="submit"
          className="bg-[#0B2C45] text-white hover:bg-[#0B2C45]/90 px-6 font-semibold shrink-0"
          data-ocid="search.submit_button"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
}
