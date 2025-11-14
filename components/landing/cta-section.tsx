"use client";

import { Button } from "@/components/ui/button";

export function CTASection() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-900">
          Ready to Improve Your Resume?
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join professionals who are landing better jobs with AI-powered resume
          insights
        </p>
        <Button
          onClick={scrollToTop}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg shadow-md transition-all"
        >
          Analyze Your Resume Now
        </Button>
      </div>
    </section>
  );
}
