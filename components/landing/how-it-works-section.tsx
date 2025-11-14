import { Zap, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Upload",
      description:
        "Drag and drop your resume or browse to upload (PDF or DOCX)",
      icon: Zap,
    },
    {
      number: 2,
      title: "Analyze",
      description: "Our AI evaluates your resume across 6 key categories",
      icon: Target,
    },
    {
      number: 3,
      title: "Improve",
      description:
        "Get detailed feedback and actionable tips to enhance your resume",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.number}
                className="border-none shadow-sm bg-white"
              >
                <CardContent className="pt-12 pb-10 px-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    {step.number}. {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
