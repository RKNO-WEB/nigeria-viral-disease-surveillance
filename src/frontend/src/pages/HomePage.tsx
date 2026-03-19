import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../App";
import type { ArticleStatus, JournalArticle } from "../backend";
import { OpenAccessBadge } from "../components/OpenAccessBadge";
import SearchBar, { type SearchParams } from "../components/SearchBar";
import { useFeaturedArticles, useLatestArticles } from "../hooks/useQueries";
import {
  ARTICLE_STATUS_COLORS,
  ARTICLE_STATUS_LABELS,
  MOCK_JOURNALS,
} from "../lib/constants";

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onSearch: (params: SearchParams) => void;
}

const SAMPLE_FEATURED: JournalArticle[] = [
  {
    id: 1n,
    title: "Advances in CRISPR-Based Gene Editing for Sickle Cell Disease",
    abstract:
      "This study presents a comprehensive review of CRISPR-Cas9 therapeutic strategies targeting the HBB gene mutation responsible for sickle cell disease, with promising clinical trial results showing 90% fetal haemoglobin reactivation in treated patients.",
    authors: ["Dr. Amaka Obi", "Prof. James Kofi", "Dr. Lena Müller"],
    journalName: "RKNO Journal of Biomedical Sciences",
    category: "Biomedical Sciences",
    publicationDate: BigInt(Date.now()) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: true,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 2n,
    title:
      "Machine Learning Models for Early Detection of Cervical Cancer in Low-Resource Settings",
    abstract:
      "We developed a lightweight convolutional neural network trained on 12,000 cervical cytology images collected across six sub-Saharan African hospitals, achieving 94.3% sensitivity and 91.7% specificity on external validation.",
    authors: ["Prof. Ngozi Adeyemi", "Dr. Chukwuemeka Okafor"],
    journalName: "RKNO Journal of Health Informatics",
    category: "Health Informatics",
    publicationDate: BigInt(Date.now() - 7 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: true,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 3n,
    title: "Postcolonial Identity and the Digital Public Sphere in West Africa",
    abstract:
      "Drawing on discourse analysis of 2.4 million social media posts from Nigeria, Ghana, and Senegal between 2018–2024, this paper examines how digital platforms reshape postcolonial identity negotiations and the emergence of pan-African online communities.",
    authors: ["Dr. Fatima Al-Hassan", "Prof. Kofi Mensah"],
    journalName: "RKNO Journal of Social Sciences",
    category: "Social Sciences",
    publicationDate: BigInt(Date.now() - 14 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: true,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 4n,
    title:
      "Solar Microgrid Optimisation for Rural Electrification in the Sahel Region",
    abstract:
      "We propose a novel multi-objective optimisation algorithm for sizing hybrid solar-battery microgrids to serve dispersed rural loads in the Sahel, reducing levelised cost of energy by 31% compared to existing heuristic methods.",
    authors: ["Eng. Binta Diallo", "Dr. Moussa Traoré", "Prof. Emre Yilmaz"],
    journalName: "RKNO Journal of Engineering",
    category: "Engineering",
    publicationDate: BigInt(Date.now() - 21 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: true,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 5n,
    title:
      "Climate Variability and Smallholder Maize Yields Across the Guinea Savannah",
    abstract:
      "Using panel data from 4,200 smallholder farms over twelve growing seasons, this study quantifies the marginal effect of temperature anomalies and erratic rainfall on maize productivity and identifies adaptation strategies that buffer yield losses.",
    authors: ["Dr. Emmanuel Asante", "Dr. Hauwa Bello"],
    journalName: "RKNO Journal of Agricultural Sciences",
    category: "Agricultural Sciences",
    publicationDate: BigInt(Date.now() - 30 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: true,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 6n,
    title:
      "Blockchain-Based Land Registry Systems: Evidence from Pilot Programmes in East Africa",
    abstract:
      "This paper evaluates three blockchain land-registry pilots in Rwanda, Kenya, and Tanzania, finding significant reductions in fraud (down 78%) and average transaction time (from 66 days to 4 days), while identifying governance and interoperability challenges.",
    authors: ["Prof. Josephine Waweru", "Dr. Ali Hassan", "Dr. Miriam Njoroge"],
    journalName: "RKNO Journal of Technology & Innovation",
    category: "Technology & Innovation",
    publicationDate: BigInt(Date.now() - 45 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: true,
    pdf: { getDirectURL: () => "#" } as any,
  },
];

const SAMPLE_LATEST: JournalArticle[] = [
  {
    id: 7n,
    title: "Urban Heat Island Mitigation Strategies in Lagos Metropolitan Area",
    abstract: "Analysis of green infrastructure interventions.",
    authors: ["Dr. Chidi Okonkwo"],
    journalName: "RKNO Journal of Environmental Studies",
    category: "Environmental Studies",
    publicationDate: BigInt(Date.now() - 2 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: false,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 8n,
    title:
      "Non-Communicable Disease Burden and Health System Readiness in Nigeria",
    abstract: "Cross-sectional analysis across 36 states.",
    authors: ["Prof. Aisha Garba", "Dr. Tunde Bello"],
    journalName: "RKNO Journal of Public Health",
    category: "Public Health",
    publicationDate: BigInt(Date.now() - 4 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: false,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 9n,
    title:
      "Afrobeat's Global Expansion: Cultural Diplomacy through Popular Music",
    abstract: "Music industry analysis and cultural theory.",
    authors: ["Dr. Sola Adeyemi"],
    journalName: "RKNO Journal of Arts & Humanities",
    category: "Arts & Humanities",
    publicationDate: BigInt(Date.now() - 6 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: false,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 10n,
    title: "Fintech Adoption and Financial Inclusion in Rural West Africa",
    abstract: "Survey evidence from 2,100 unbanked households.",
    authors: ["Dr. Obi Nwosu", "Prof. Ama Asante"],
    journalName: "RKNO Journal of Economics & Finance",
    category: "Economics & Finance",
    publicationDate: BigInt(Date.now() - 9 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: false,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 11n,
    title: "Structural Integrity Assessment of Ageing Road Bridges in Nigeria",
    abstract: "Non-destructive evaluation using ground-penetrating radar.",
    authors: ["Eng. Ike Eze"],
    journalName: "RKNO Journal of Engineering",
    category: "Engineering",
    publicationDate: BigInt(Date.now() - 11 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: false,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 12n,
    title:
      "Teacher Training and Learning Outcomes in Under-Resourced Secondary Schools",
    abstract: "Randomised control trial across 60 schools in Kano State.",
    authors: ["Prof. Zainab Musa", "Dr. Grace Nwosu"],
    journalName: "RKNO Journal of Education",
    category: "Education",
    publicationDate: BigInt(Date.now() - 13 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: false,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 13n,
    title:
      "Anti-Corruption Law Enforcement and Investor Confidence in West Africa",
    abstract: "Panel econometric study across ECOWAS member states.",
    authors: ["Dr. Emeka Eze", "Prof. Kwame Asare"],
    journalName: "RKNO Journal of Law & Governance",
    category: "Law & Governance",
    publicationDate: BigInt(Date.now() - 16 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: false,
    pdf: { getDirectURL: () => "#" } as any,
  },
  {
    id: 14n,
    title:
      "Cassava Processing Innovations and Smallholder Income in South-West Nigeria",
    abstract: "Value-chain analysis and impact assessment.",
    authors: ["Dr. Funmi Adebayo"],
    journalName: "RKNO Journal of Agricultural Sciences",
    category: "Agricultural Sciences",
    publicationDate: BigInt(Date.now() - 18 * 86400000) * 1_000_000n,
    status: "published" as unknown as ArticleStatus,
    featured: false,
    pdf: { getDirectURL: () => "#" } as any,
  },
];

function formatDate(nanoseconds?: bigint): string {
  if (!nanoseconds) return "—";
  const ms = Number(nanoseconds / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ArticleDetailModal({
  article,
  onClose,
}: {
  article: JournalArticle | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!article} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl" data-ocid="article.dialog">
        {article && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge
                  variant="secondary"
                  className="text-[10px] font-bold uppercase tracking-wider shrink-0"
                >
                  {article.category}
                </Badge>
                <OpenAccessBadge />
              </div>
              <DialogTitle className="font-serif text-[#0B2C45] text-xl leading-snug text-left">
                {article.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {article.authors.join(", ")}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {article.journalName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(article.publicationDate)}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
                  Abstract
                </p>
                <p className="font-serif text-[#374151] text-sm leading-relaxed">
                  {article.abstract}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={article.pdf.getDirectURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="article.download_button"
                >
                  <Button className="bg-[#0B2C45] text-white hover:bg-[#0B2C45]/90 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </a>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function FeaturedArticleCard({
  article,
  index,
  onOpen,
}: {
  article: JournalArticle;
  index: number;
  onOpen: (a: JournalArticle) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <Card
        className="border border-slate-200 hover:shadow-card transition-shadow h-full cursor-pointer group"
        onClick={() => onOpen(article)}
        data-ocid={`featured.item.${index + 1}`}
      >
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
              {article.category}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                ARTICLE_STATUS_COLORS[article.status as ArticleStatus] ??
                "bg-slate-100 text-slate-600"
              }`}
            >
              {ARTICLE_STATUS_LABELS[article.status as ArticleStatus] ??
                String(article.status)}
            </span>
          </div>
          <h3 className="font-serif font-semibold text-[#111827] text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-[#0B2C45] transition-colors">
            {article.title}
          </h3>
          <div className="mb-2">
            <OpenAccessBadge />
          </div>
          <p className="text-[#6B7280] text-xs mb-2">
            {article.authors.join(", ")} · {article.journalName}
          </p>
          <p className="font-serif text-[#6B7280] text-xs leading-relaxed line-clamp-3 flex-1 mb-4">
            {article.abstract}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[#6B7280] text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.publicationDate)}
            </span>
            <button
              type="button"
              className="text-[#0B2C45] text-xs font-medium hover:underline"
            >
              Read abstract →
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FeaturedResearchSection({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(
    null,
  );
  const { data: liveArticles, isLoading } = useFeaturedArticles();
  const articles =
    liveArticles && liveArticles.length > 0 ? liveArticles : SAMPLE_FEATURED;

  return (
    <section
      className="max-w-7xl mx-auto px-6 py-12"
      data-ocid="featured.section"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0B2C45] font-display">
            Featured Research
          </h2>
          <p className="font-serif text-[#6B7280] text-sm mt-1">
            Hand-picked articles of exceptional scholarly merit
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("journals")}
          className="text-[#0B2C45] text-sm font-medium hover:underline flex items-center gap-1"
          data-ocid="featured.link"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="featured.loading_state"
        >
          {(["s1", "s2", "s3", "s4", "s5", "s6"] as const).map((sk) => (
            <Card key={sk} className="border border-slate-200">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article, i) => (
            <FeaturedArticleCard
              key={article.id.toString()}
              article={article}
              index={i}
              onOpen={setSelectedArticle}
            />
          ))}
        </div>
      )}

      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
}

function LatestIssuesSection({
  onNavigate,
}: {
  onNavigate: (page: Page) => void;
}) {
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(
    null,
  );
  const { data: liveArticles, isLoading } = useLatestArticles(8n);
  const articles =
    liveArticles && liveArticles.length > 0 ? liveArticles : SAMPLE_LATEST;

  return (
    <section
      className="bg-[#F8FAFC] border-t border-slate-200 py-12"
      data-ocid="latest.section"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0B2C45] font-display">
              Latest Issues
            </h2>
            <p className="font-serif text-[#6B7280] text-sm mt-1">
              Most recently published research from all journals
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("journals")}
            className="text-[#0B2C45] text-sm font-medium hover:underline flex items-center gap-1"
            data-ocid="latest.link"
          >
            Browse all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3" data-ocid="latest.loading_state">
            {(["l1", "l2", "l3", "l4", "l5", "l6"] as const).map((sk) => (
              <div
                key={sk}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200"
              >
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-3 w-20 shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3" data-ocid="latest.list">
            {articles.map((article, i) => (
              <motion.div
                key={article.id.toString()}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="w-full text-left flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0B2C45]/30 hover:shadow-xs transition-all group"
                  data-ocid={`latest.item.${i + 1}`}
                >
                  <div className="w-10 h-10 bg-[#0B2C45]/8 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#0B2C45]/15 transition-colors">
                    <FileText className="w-5 h-5 text-[#0B2C45]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-[#111827] text-sm leading-snug line-clamp-1 group-hover:text-[#0B2C45] transition-colors mb-1">
                      {article.title}
                    </h3>
                    <div className="mb-1">
                      <OpenAccessBadge />
                    </div>
                    <p className="text-[#6B7280] text-xs">
                      {article.journalName}
                      {" · "}
                      {article.authors.slice(0, 2).join(", ")}
                      {article.authors.length > 2 &&
                        ` +${article.authors.length - 2} more`}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[#6B7280] text-xs whitespace-nowrap flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.publicationDate)}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline-flex"
                    >
                      {article.category}
                    </Badge>
                  </div>
                </button>
              </motion.div>
            ))}

            {articles.length === 0 && (
              <div
                className="text-center py-16 text-[#6B7280] font-serif"
                data-ocid="latest.empty_state"
              >
                No articles published yet.
              </div>
            )}
          </div>
        )}
      </div>

      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
}

export default function HomePage({ onNavigate, onSearch }: HomePageProps) {
  const recentJournals = MOCK_JOURNALS.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#E9EFF4] py-16 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0B2C45]/10 text-[#0B2C45] rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2C45] animate-pulse" />
                Call for Papers — Volume 3, 2026
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-[#111827] leading-tight mb-5">
                Advancing Knowledge Through Peer-Reviewed Research
              </h1>
              <p className="font-serif text-[#6B7280] text-lg leading-relaxed mb-8">
                RKNO WEB is a trusted platform for publishing and accessing
                rigorous, peer-reviewed academic research across all
                disciplines.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => onNavigate("submit")}
                  className="bg-[#0B2C45] text-white hover:bg-[#0B2C45]/90 px-6"
                  data-ocid="hero.submit_button"
                >
                  Submit Manuscript
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate("journals")}
                  className="border-[#0B2C45] text-[#0B2C45] hover:bg-[#0B2C45]/5 px-6"
                  data-ocid="hero.secondary_button"
                >
                  Browse Journals
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="bg-[#0B2C45] rounded-2xl p-8 text-white w-80">
                <BookOpen className="w-10 h-10 mb-4 opacity-80" />
                <div className="font-display text-2xl font-bold mb-2">
                  Open Access
                </div>
                <p className="font-serif text-white/60 text-sm leading-relaxed mb-6">
                  All articles are freely accessible to readers worldwide with
                  no subscription barriers.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold">770+</div>
                    <div className="text-white/50 text-xs mt-1">Articles</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold">6</div>
                    <div className="text-white/50 text-xs mt-1">Journals</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold">40+</div>
                    <div className="text-white/50 text-xs mt-1">Countries</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold">120+</div>
                    <div className="text-white/50 text-xs mt-1">Reviewers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Strip */}
      <section className="bg-slate-100 border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[#0B2C45] font-semibold text-sm mb-3 uppercase tracking-wider">
            Search &amp; Filter Articles
          </p>
          <SearchBar onSearch={onSearch} />
        </div>
      </section>

      {/* Feature Boxes */}
      <section className="bg-[#0B2C45] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: BookOpen,
                title: "Aims & Scope",
                desc: "Multidisciplinary peer-reviewed research across all academic fields",
              },
              {
                icon: FileText,
                title: "Publish Books & Thesis",
                desc: "Convert your thesis or dissertation into a published book with ISBN",
              },
              {
                icon: Star,
                title: "Reviewer Rewards",
                desc: "Earn monthly through our Reviewership rewards programme",
              },
              {
                icon: Users,
                title: "Editorial Board",
                desc: "Led by distinguished scholars from top global institutions",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/10 rounded-xl p-5 text-white"
              >
                <Icon className="w-6 h-6 mb-3 text-white/70" />
                <div className="font-semibold text-sm mb-1.5">{title}</div>
                <p className="font-serif text-white/50 text-xs leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Research (live) ── */}
      <div className="border-t border-slate-100">
        <FeaturedResearchSection onNavigate={onNavigate} />
      </div>

      {/* ── Latest Issues (live) ── */}
      <LatestIssuesSection onNavigate={onNavigate} />

      {/* Main Content – sidebar */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Highlighted Journals */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#111827]">Our Journals</h2>
              <button
                type="button"
                onClick={() => onNavigate("journals")}
                className="text-[#0B2C45] text-sm font-medium hover:underline flex items-center gap-1"
              >
                All journals <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentJournals.map((journal) => (
                <div
                  key={journal.id}
                  className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-[#0B2C45] rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] mb-2">
                    {journal.category}
                  </Badge>
                  <h3 className="font-serif font-semibold text-[#111827] text-sm leading-snug mb-2">
                    {journal.name}
                  </h3>
                  <p className="text-[#6B7280] text-xs mb-1">{journal.issn}</p>
                  <p className="font-serif text-[#6B7280] text-xs leading-relaxed mb-4 line-clamp-2">
                    {journal.description}
                  </p>
                  <p className="text-[10px] font-semibold text-[#6B7280]">
                    {journal.articlesCount} articles · {journal.frequency}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Latest News */}
            <Card className="border border-[#E5E7EB]">
              <CardContent className="p-5">
                <h3 className="font-bold text-[#111827] text-sm uppercase tracking-wide mb-4">
                  Latest News
                </h3>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Call for Papers: Special Issue on AI & Society",
                      date: "Mar 10, 2026",
                    },
                    {
                      title:
                        "New Partnership with African Academic Libraries Network",
                      date: "Feb 28, 2026",
                    },
                    {
                      title: "RKNO WEB achieves DOAJ indexing certification",
                      date: "Feb 15, 2026",
                    },
                    {
                      title: "Volume 3 Issue 1 now available online",
                      date: "Jan 30, 2026",
                    },
                  ].map(({ title, date }) => (
                    <li
                      key={title}
                      className="border-b border-[#F2F4F7] last:border-0 pb-3 last:pb-0"
                    >
                      <p className="font-serif text-[#111827] text-xs font-medium leading-snug mb-1">
                        {title}
                      </p>
                      <p className="text-[#6B7280] text-[10px]">{date}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Submission Guidelines */}
            <Card className="border border-[#E5E7EB]">
              <CardContent className="p-5">
                <h3 className="font-bold text-[#111827] text-sm uppercase tracking-wide mb-4">
                  Submission Guidelines
                </h3>
                <ul className="space-y-2">
                  {[
                    "Manuscript must be original work",
                    "Max 8,000 words for research articles",
                    "APA 7th edition referencing",
                    "Double-blind peer review process",
                    "PDF or DOCX format accepted",
                  ].map((item) => (
                    <li
                      key={item}
                      className="font-serif text-[#6B7280] text-xs flex items-start gap-2"
                    >
                      <span className="text-[#0B2C45] mt-0.5">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  onClick={() => onNavigate("submit")}
                  className="w-full mt-4 bg-[#0B2C45] text-white hover:bg-[#0B2C45]/90 text-xs"
                  data-ocid="sidebar.submit_button"
                >
                  Submit Now
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border border-[#E5E7EB]">
              <CardContent className="p-5">
                <h3 className="font-bold text-[#111827] text-sm uppercase tracking-wide mb-4">
                  Upcoming Events
                </h3>
                <ul className="space-y-3">
                  {[
                    {
                      event: "RKNO International Conference 2026",
                      date: "Jun 15–17, 2026",
                    },
                    {
                      event: "Manuscript Submission Deadline — Vol.3 Iss.2",
                      date: "Apr 30, 2026",
                    },
                    {
                      event: "Reviewer Training Webinar",
                      date: "Apr 10, 2026",
                    },
                  ].map(({ event, date }) => (
                    <li key={event} className="text-xs">
                      <p className="font-serif font-medium text-[#111827] leading-snug">
                        {event}
                      </p>
                      <p className="text-[#6B7280] mt-0.5">{date}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#0B2C45] py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to Publish Your Research?
          </h2>
          <p className="font-serif text-white/60 mb-8 max-w-2xl mx-auto">
            Join thousands of researchers worldwide who trust RKNO WEB for
            publishing their peer-reviewed work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => onNavigate("submit")}
              className="bg-white text-[#0B2C45] hover:bg-white/90 font-semibold px-8"
              data-ocid="cta.submit_button"
            >
              Submit Manuscript
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate("about")}
              className="border-white text-white hover:bg-white/10 px-8"
              data-ocid="cta.secondary_button"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
