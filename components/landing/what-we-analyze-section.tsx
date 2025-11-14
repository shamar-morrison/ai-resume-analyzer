import { CircleCheck } from "lucide-react";

export function WhatWeAnalyzeSection() {
  const categories = [
    {
      title: "Organization",
      description: "Layout, sections, and hierarchy",
    },
    {
      title: "Content Quality",
      description: "Relevance, clarity, and impact",
    },
    {
      title: "Formatting",
      description: "Consistency and visual appeal",
    },
    {
      title: "ATS Optimization",
      description: "Industry keywords and matching",
    },
    {
      title: "Achievements",
      description: "Quantifiable results and impact",
    },
    {
      title: "Grammar",
      description: "Spelling and professionalism",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          What We Analyze
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {categories.map((category) => (
            <div key={category.title} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CircleCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
