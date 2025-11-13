import { FileText } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

export function EmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileText />
        </EmptyMedia>
        <EmptyTitle>No analyses yet</EmptyTitle>
        <EmptyDescription>
          Upload your first resume to get started with AI-powered analysis and feedback.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
