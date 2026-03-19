import { BookOpen, Globe, Star, Users } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-[#0B2C45] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">About RKNO WEB</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Research & Knowledge Web — a global platform for advancing academic
            scholarship through rigorous peer review.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#E5E7EB] py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, value: "770+", label: "Articles Published" },
              { icon: Globe, value: "6", label: "Journals" },
              { icon: Globe, value: "40+", label: "Countries" },
              { icon: Users, value: "120+", label: "Reviewers" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon className="w-6 h-6 text-[#0B2C45] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#111827]">{value}</div>
                <div className="text-[#6B7280] text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-[#111827] mb-4">
              Our Mission
            </h2>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              RKNO WEB is dedicated to providing an open-access, peer-reviewed
              publishing platform that empowers researchers across the globe to
              share knowledge, drive innovation, and contribute to the
              advancement of their disciplines.
            </p>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              We believe that knowledge should be freely accessible. All our
              published articles are available at no cost to readers, removing
              financial barriers to academic information worldwide.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              Our rigorous double-blind peer review process ensures that every
              article published meets the highest standards of academic
              integrity and scientific rigor.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#111827] mb-4">
              Aims & Scope
            </h2>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              RKNO WEB publishes original research, review articles, case
              studies, and technical reports across all major academic
              disciplines including:
            </p>
            <ul className="space-y-2">
              {[
                "Computer Science & Information Technology",
                "Medical & Health Sciences",
                "Engineering & Applied Technology",
                "Social Sciences & Humanities",
                "Natural & Environmental Sciences",
                "Business, Economics & Management",
                "Mathematics & Statistics",
                "Education & Pedagogy",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-[#6B7280]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B2C45] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Editorial Board */}
      <section className="bg-[#F2F4F7] py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#111827] mb-2">
            Editorial Board
          </h2>
          <p className="text-[#6B7280] mb-8">
            Our editorial board comprises distinguished scholars from leading
            institutions worldwide.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                name: "Prof. Amara Nwosu",
                title: "Editor-in-Chief",
                institution: "University of Lagos",
                field: "Computer Science",
              },
              {
                name: "Dr. Sarah Chen",
                title: "Associate Editor",
                institution: "MIT",
                field: "Engineering",
              },
              {
                name: "Prof. Kwame Mensah",
                title: "Section Editor",
                institution: "University of Ghana",
                field: "Health Sciences",
              },
              {
                name: "Dr. Fatima Al-Rashid",
                title: "Associate Editor",
                institution: "AUC Cairo",
                field: "Social Sciences",
              },
              {
                name: "Prof. James Osei",
                title: "Section Editor",
                institution: "Stellenbosch University",
                field: "Environmental Science",
              },
              {
                name: "Dr. Priya Patel",
                title: "Managing Editor",
                institution: "IIT Bombay",
                field: "Mathematics",
              },
            ].map(({ name, title, institution, field }) => (
              <div
                key={name}
                className="bg-white border border-[#E5E7EB] rounded-xl p-5"
              >
                <div className="w-12 h-12 rounded-full bg-[#0B2C45] flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">
                    {name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-bold text-[#111827] text-sm">{name}</h3>
                <p className="text-[#0B2C45] text-xs font-medium mt-0.5">
                  {title}
                </p>
                <p className="text-[#6B7280] text-xs mt-1">{institution}</p>
                <p className="text-[#9CA3AF] text-xs mt-0.5">{field}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-[#111827] mb-8 text-center">
          Why Choose RKNO WEB?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Star,
              title: "Rigorous Peer Review",
              desc: "Double-blind review by domain experts ensuring quality and integrity.",
            },
            {
              icon: Globe,
              title: "Global Reach",
              desc: "Indexed in major databases with readers in 40+ countries.",
            },
            {
              icon: BookOpen,
              title: "Open Access",
              desc: "Free access for all readers worldwide — no paywalls, no barriers.",
            },
            {
              icon: Users,
              title: "Reviewer Rewards",
              desc: "Earn monthly rewards for completing peer reviews.",
            },
            {
              icon: BookOpen,
              title: "Fast Turnaround",
              desc: "Initial decision within 4–6 weeks of submission.",
            },
            {
              icon: Star,
              title: "DOI Assignment",
              desc: "Every published article receives a permanent DOI identifier.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#F2F4F7] rounded-xl p-5">
              <Icon className="w-6 h-6 text-[#0B2C45] mb-3" />
              <h3 className="font-bold text-[#111827] text-sm mb-2">{title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
