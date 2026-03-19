import { ArticleStatus } from "../backend";

export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  [ArticleStatus.underReview]: "Under Review",
  [ArticleStatus.published]: "Published",
  [ArticleStatus.rejected]: "Rejected",
};

export const ARTICLE_STATUS_COLORS: Record<ArticleStatus, string> = {
  [ArticleStatus.underReview]: "bg-yellow-100 text-yellow-800",
  [ArticleStatus.published]: "bg-green-100 text-green-800",
  [ArticleStatus.rejected]: "bg-red-100 text-red-800",
};

export const JOURNAL_CATEGORIES = [
  "Computer Science & IT",
  "Medical & Health Sciences",
  "Engineering & Technology",
  "Social Sciences",
  "Natural Sciences",
  "Mathematics & Statistics",
  "Business & Economics",
  "Arts & Humanities",
  "Environmental Sciences",
  "Education",
];

export const MOCK_ARTICLES = [
  {
    id: 1,
    title:
      "Advancements in Neural Network Architectures for Natural Language Processing",
    authors: ["Dr. A. Okonkwo", "Prof. S. Chen"],
    journalName: "RKNO Journal of Computer Science",
    category: "Computer Science & IT",
    abstract:
      "This paper presents a comprehensive review of recent advancements in transformer-based neural network architectures and their applications in natural language understanding tasks...",
    status: ArticleStatus.published,
    publicationDate: "2025-11-15",
  },
  {
    id: 2,
    title: "Climate Change Impact on Coastal Ecosystems: A Longitudinal Study",
    authors: ["Dr. M. Adeyemi", "Dr. L. Osei"],
    journalName: "RKNO Environmental Research Journal",
    category: "Environmental Sciences",
    abstract:
      "We present findings from a 10-year longitudinal study examining the effects of rising sea temperatures on biodiversity in West African coastal ecosystems...",
    status: ArticleStatus.published,
    publicationDate: "2025-10-02",
  },
  {
    id: 3,
    title:
      "Telemedicine Adoption in Sub-Saharan Africa: Barriers and Opportunities",
    authors: ["Prof. F. Nwosu", "Dr. R. Mensah"],
    journalName: "RKNO Journal of Health Sciences",
    category: "Medical & Health Sciences",
    abstract:
      "This study investigates the adoption rates and challenges of telemedicine services across 12 sub-Saharan African countries, identifying key barriers and policy recommendations...",
    status: ArticleStatus.published,
    publicationDate: "2025-09-18",
  },
  {
    id: 4,
    title:
      "Blockchain Technology in Supply Chain Management: A Systematic Review",
    authors: ["Dr. K. Ibrahim"],
    journalName: "RKNO Business & Technology Review",
    category: "Business & Economics",
    abstract:
      "A systematic review of 87 studies examining blockchain applications in global supply chain management, focusing on transparency, traceability, and efficiency gains...",
    status: ArticleStatus.published,
    publicationDate: "2025-08-30",
  },
  {
    id: 5,
    title:
      "Quantum Computing Applications in Cryptography: Current State and Future Prospects",
    authors: ["Dr. J. Patel", "Prof. A. Williams"],
    journalName: "RKNO Journal of Computer Science",
    category: "Computer Science & IT",
    abstract:
      "This paper surveys quantum computing algorithms relevant to cryptographic protocols, analyzing their computational advantages and potential impact on existing security infrastructure...",
    status: ArticleStatus.published,
    publicationDate: "2025-08-10",
  },
  {
    id: 6,
    title:
      "Renewable Energy Integration in Developing Economies: Policy Framework Analysis",
    authors: ["Prof. C. Obi", "Dr. E. Dankwa"],
    journalName: "RKNO Journal of Engineering",
    category: "Engineering & Technology",
    abstract:
      "An analysis of national energy policies across 20 developing economies, evaluating frameworks for renewable energy integration and their effectiveness in achieving sustainability targets...",
    status: ArticleStatus.published,
    publicationDate: "2025-07-22",
  },
];

export const MOCK_JOURNALS = [
  {
    id: 1,
    name: "RKNO Journal of Computer Science",
    issn: "ISSN 2754-1234",
    category: "Computer Science & IT",
    description:
      "A peer-reviewed journal publishing original research in all areas of computer science, software engineering, and information technology.",
    frequency: "Quarterly",
    articlesCount: 142,
  },
  {
    id: 2,
    name: "RKNO Journal of Health Sciences",
    issn: "ISSN 2754-2345",
    category: "Medical & Health Sciences",
    description:
      "Dedicated to advancing knowledge in medicine, public health, clinical research, and health policy with a focus on global health challenges.",
    frequency: "Bi-monthly",
    articlesCount: 218,
  },
  {
    id: 3,
    name: "RKNO Journal of Engineering",
    issn: "ISSN 2754-3456",
    category: "Engineering & Technology",
    description:
      "Publishing cutting-edge research in mechanical, electrical, civil, and chemical engineering with emphasis on sustainable innovations.",
    frequency: "Quarterly",
    articlesCount: 97,
  },
  {
    id: 4,
    name: "RKNO Environmental Research Journal",
    issn: "ISSN 2754-4567",
    category: "Environmental Sciences",
    description:
      "A multidisciplinary journal covering environmental science, ecology, climate science, and conservation biology.",
    frequency: "Quarterly",
    articlesCount: 83,
  },
  {
    id: 5,
    name: "RKNO Business & Technology Review",
    issn: "ISSN 2754-5678",
    category: "Business & Economics",
    description:
      "Exploring the intersection of business management, economics, and emerging technologies in global and regional markets.",
    frequency: "Bi-monthly",
    articlesCount: 156,
  },
  {
    id: 6,
    name: "RKNO Social Sciences Quarterly",
    issn: "ISSN 2754-6789",
    category: "Social Sciences",
    description:
      "Advancing knowledge in sociology, political science, anthropology, and related disciplines with an African and global perspective.",
    frequency: "Quarterly",
    articlesCount: 74,
  },
];
