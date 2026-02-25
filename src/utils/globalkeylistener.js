import React, { useEffect, useCallback } from 'react';

export function GlobalKeyListener(fn) {
  const handleGlobalKeyDown = useCallback(fn, []); // Memoize the handler

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener('keydown', handleGlobalKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleGlobalKeyDown]); // Re-run effect if the handler changes
}
