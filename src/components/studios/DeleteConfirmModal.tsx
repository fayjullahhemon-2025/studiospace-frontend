"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studioTitle: string;
  isDeleting: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  studioTitle,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-2xl text-foreground">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Cancel deletion"
          className="absolute top-5 right-5 flex size-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:pointer-events-none"
        >
          <X className="size-4" />
        </button>

        {/* Warning Badge */}
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 mb-4">
          <AlertTriangle className="size-7" />
        </div>

        <div className="text-center">
          <h2
            id="delete-dialog-title"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            Delete Studio Listing?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &quot;{studioTitle}&quot;
            </span>
            ? This will permanently remove the studio document from MongoDB and
            cancel future discovery.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 h-11 rounded-full border border-border bg-muted/40 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Keep Listing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-full bg-red-600 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 shadow-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Deleting…</span>
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteConfirmModal;
