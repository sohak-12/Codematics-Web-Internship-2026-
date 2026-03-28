"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { InterviewCategory } from "@/constants/categories";

const CATEGORY_TAGS: Record<string, string[]> = {
  frontend: ["React", "CSS", "DOM"],
  backend: ["Node", "API", "DB"],
  fullstack: ["Full", "E2E", "Deploy"],
  technical: ["DSA", "Logic", "O(n)"],
  hr: ["Culture", "Soft", "Goals"],
  behavioral: ["STAR", "Lead", "Team"],
  "system-design": ["Scale", "Cache", "LB"],
  react: ["Hooks", "State", "Perf"],
  nextjs: ["SSR", "RSC", "API"],
  javascript: ["ES6+", "Async", "Scope"],
  dsa: ["Array", "Tree", "Graph"],
  devops: ["CI/CD", "Docker", "K8s"],
  "ai-engineer": ["LLM", "RAG", "ML"],
};

export function CategoryCard({ category, index = 0 }: { category: InterviewCategory; index?: number }) {
  const Icon = category.icon;
  const isTech = ["frontend", "backend", "react", "nextjs", "javascript", "dsa", "technical"].includes(category.id);
  const isHR = ["hr", "behavioral"].includes(category.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <Link href={`/interview/${category.id}`}>
        <div className="glass p-5 h-full cursor-pointer group relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className={`badge ${isTech ? "badge-tech" : isHR ? "badge-hr" : "badge-mixed"}`}>
              {isTech ? "Technical" : isHR ? "HR" : "Mixed"}
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: `${category.color}15` }}>
            <Icon className="w-7 h-7" style={{ color: category.color }} />
          </div>
          <h3 className="text-[var(--text-primary)] font-semibold text-[15px] mb-1.5">{category.title}</h3>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">{category.description}</p>
          <div className="flex items-center gap-1.5 mb-4">
            {(CATEGORY_TAGS[category.id] || ["Tech", "Pro", "AI"]).map((t) => (
              <span key={t} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--accent-bg)] text-[var(--accent)]">{t}</span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-glass)]">
            <span className="text-[var(--text-muted)] text-xs">AI Powered</span>
            <span className="text-sm font-medium text-[var(--accent)] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">View Interview →</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/[0.03] via-transparent to-[var(--accent-light)]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[1.25rem]" />
        </div>
      </Link>
    </motion.div>
  );
}
