"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAnalysis } from "@/lib/actions/analysis.actions";
import { useUser } from "@clerk/nextjs";

interface DeleteAnalysisButtonProps {
  analysisId: string;
  analysisName: string;
  onDelete: (id: string) => void;
}

export function DeleteAnalysisButton({
  analysisId,
  analysisName,
  onDelete,
}: DeleteAnalysisButtonProps) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const success = await deleteAnalysis(analysisId, user.id);

      if (success) {
        onDelete(analysisId);
        setIsOpen(false);
      } else {
        // Handle error - could add toast notification here
        console.error("Failed to delete analysis");
        alert("Failed to delete analysis. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting analysis:", error);
      alert("An error occurred while deleting. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click navigation
          setIsOpen(true);
        }}
        aria-label="Delete analysis"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
      >
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Delete Analysis</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the analysis for "{analysisName}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
