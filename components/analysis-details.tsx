"use client";

import { SerializedAnalysis } from '@/lib/models/analysis.model';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState } from 'react';

interface AnalysisDetailsProps {
  analysis: SerializedAnalysis;
}

const categoryLabels: Record<string, string> = {
  organization: 'Organization & Structure',
  content: 'Content Quality',
  formatting: 'Formatting & Design',
  keywords: 'Keywords & ATS Optimization',
  achievements: 'Achievements & Impact',
  grammar: 'Grammar & Language',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreBgColor(score: number): string {
  if (score >= 8) return 'bg-green-100 border-green-200';
  if (score >= 6) return 'bg-yellow-100 border-yellow-200';
  return 'bg-red-100 border-red-200';
}

function CategoryCard({
  title,
  score,
  tips
}: {
  title: string;
  score: number;
  tips: string[]
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}/10
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <Progress value={score * 10} className="h-2" />
        </div>

        {/* Tips Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {isExpanded ? 'Hide' : 'View'} improvement tips ({tips.length})
        </button>

        {/* Tips List */}
        {isExpanded && (
          <ul className="space-y-2 pl-1">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <TrendingUp className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

export function AnalysisDetails({ analysis }: AnalysisDetailsProps) {
  const scoreColor = getScoreColor(analysis.overallScore);
  const scoreBgColor = getScoreBgColor(analysis.overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <Link href="/" className="text-xl font-semibold">
              ResumeAI
            </Link>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Overall Score */}
        <div className="mb-8">
          <Card className={`p-8 border-2 ${scoreBgColor}`}>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-gray-600" />
                <h1 className="text-3xl font-bold text-gray-900">{analysis.resumeName}</h1>
              </div>

              {/* Overall Score */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Overall Score
                </p>
                <div className={`text-7xl font-bold ${scoreColor}`}>
                  {analysis.overallScore.toFixed(1)}
                  <span className="text-3xl text-gray-400">/10</span>
                </div>
                <Badge variant={
                  analysis.status === 'Excellent' ? 'success' :
                  analysis.status === 'Good' ? 'default' :
                  analysis.status === 'Needs Improvement' ? 'warning' :
                  'danger'
                }>
                  {analysis.status}
                </Badge>
              </div>

              {/* File Metadata */}
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{analysis.fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatFileSize(analysis.fileSize)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(analysis.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Key Strengths</h2>
              </div>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Priority Improvements */}
          <Card className="p-6 bg-orange-50 border-orange-200">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">Priority Improvements</h2>
              </div>
              <ul className="space-y-2">
                {analysis.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <AlertCircle className="h-5 w-5 mt-0.5 text-orange-600 flex-shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Category Scores */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Category Analysis</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(analysis.categoryScores).map(([key, data]) => (
              <CategoryCard
                key={key}
                title={categoryLabels[key] || key}
                score={data.score}
                tips={data.tips}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <FileText className="h-5 w-5" />
              Analyze Another Resume
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
