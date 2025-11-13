"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IAnalysis } from "@/lib/models/analysis.model";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface AnalysisCardProps {
  analysis: IAnalysis;
  onClick?: () => void;
}

export function AnalysisCard({ analysis, onClick }: AnalysisCardProps) {
  // Determine badge variant based on score
  const getBadgeVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 65) return "warning";
    return "danger";
  };

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "text-green-600";
      case "Good":
        return "text-blue-600";
      case "Needs Improvement":
        return "text-red-600";
      case "Poor":
        return "text-red-700";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card
      className="p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{analysis.resumeName}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {format(new Date(analysis.createdAt), "MMM dd, yyyy")}
          </p>
          <div className={`flex items-center gap-1.5 text-sm font-medium ${getStatusColor(analysis.status)}`}>
            <TrendingUp className="w-4 h-4" />
            {analysis.status}
          </div>
        </div>
        <Badge variant={getBadgeVariant(analysis.score)}>
          {analysis.score}/100
        </Badge>
      </div>
    </Card>
  );
}
