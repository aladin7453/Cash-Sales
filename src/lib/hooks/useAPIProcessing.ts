import { useState, useCallback } from 'react';

/**
 * Hook to manage API processing state and prevent multiple simultaneous API calls
 * @returns {Object} API processing state and wrapper function
 */
export function useAPIProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Wraps an async function to prevent multiple calls while processing
   * @param {Function} asyncFn - The async function to wrap
   * @returns {Function} Wrapped function that prevents multiple calls
   */
  const withProcessing = useCallback(
    (asyncFn) => async (...args) => {
      if (isProcessing) return;
      
      try {
        setIsProcessing(true);
        return await asyncFn(...args);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing]
  );

  return {
    isProcessing,
    withProcessing
  };
}