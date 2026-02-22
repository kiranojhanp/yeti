"use client";

import { toast as sonnerToast } from "sonner";

/**
 * Sonner handles all the state (IDs, dismissing, queuing) internally.
 * This wrapper maintains the 'useToast' pattern while using Sonner's engine.
 */

export function useToast() {
  return {
    toast: sonnerToast,
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  };
}

// Export the direct toast function for use outside of components
export { sonnerToast as toast };
