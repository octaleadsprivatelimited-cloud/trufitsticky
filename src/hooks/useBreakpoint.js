import { useState, useEffect } from 'react';
import { useDebouncedResize } from './useDebounce';

/**
 * Custom hook to get responsive breakpoints
 * @returns {Object} Breakpoint flags
 */
export function useBreakpoint() {
  const debouncedWidth = useDebouncedResize(150);

  return {
    isMobile: debouncedWidth < 768,
    isTablet: debouncedWidth >= 768 && debouncedWidth < 1024,
    isDesktop: debouncedWidth >= 1024 && debouncedWidth < 1440,
    isLargeDesktop: debouncedWidth >= 1440,
  };
}

