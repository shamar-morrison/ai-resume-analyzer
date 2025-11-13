import { FileText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <FileText className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No analyses yet
      </h3>
      <p className="text-sm text-gray-500 max-w-sm">
        Upload your first resume to get started with AI-powered analysis and feedback.
      </p>
    </div>
  );
}
