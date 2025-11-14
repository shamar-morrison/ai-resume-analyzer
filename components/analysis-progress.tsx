'use client'

import { Progress } from '@/components/ui/progress'
import { FileText, FileCheck, Brain, Database } from 'lucide-react'

export type AnalysisStep = 'uploading' | 'extracting' | 'analyzing' | 'saving'

interface AnalysisProgressProps {
  fileName: string
  fileSize: number
  currentStep: AnalysisStep
  progress: number
}

const steps: Record<
  AnalysisStep,
  { label: string; icon: typeof FileText; progress: number }
> = {
  uploading: {
    label: 'Uploading file...',
    icon: FileText,
    progress: 25,
  },
  extracting: {
    label: 'Extracting text...',
    icon: FileCheck,
    progress: 50,
  },
  analyzing: {
    label: 'Analyzing with AI...',
    icon: Brain,
    progress: 90,
  },
  saving: {
    label: 'Saving results...',
    icon: Database,
    progress: 100,
  },
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AnalysisProgress({
  fileName,
  fileSize,
  currentStep,
  progress,
}: AnalysisProgressProps) {
  const stepConfig = steps[currentStep]
  const Icon = stepConfig.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center">
            <Icon className="h-12 w-12 text-blue-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Analyzing Resume</h2>
          <p className="mt-1 text-sm text-gray-500">{stepConfig.label}</p>
        </div>

        {/* File Info */}
        <div className="mb-6 rounded-md bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p
                  className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                  title={fileName}
                >
                  {fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(fileSize)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-center text-sm font-medium text-gray-700">
            {progress}%
          </p>
        </div>

        {/* Step Indicators */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {Object.entries(steps).map(([key, step]) => {
            const StepIcon = step.icon
            const isActive = key === currentStep
            const isCompleted = step.progress < stepConfig.progress

            return (
              <div
                key={key}
                className={`flex flex-col items-center space-y-1 ${
                  isActive
                    ? 'text-blue-500'
                    : isCompleted
                      ? 'text-green-500'
                      : 'text-gray-300'
                }`}
              >
                <StepIcon className="h-5 w-5" />
                <span className="text-xs font-medium">
                  {step.label.split(' ')[0]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
