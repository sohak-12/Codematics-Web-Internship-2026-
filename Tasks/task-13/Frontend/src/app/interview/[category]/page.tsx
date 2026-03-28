"use client";

import { use } from "react";
import { InterviewScreen } from "@/components/InterviewScreen";

export default function InterviewPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  return (
    <main className="min-h-screen overflow-hidden">
      <InterviewScreen categoryId={category} />
    </main>
  );
}
