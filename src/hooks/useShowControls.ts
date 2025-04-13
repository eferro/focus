
import { useState, useCallback } from 'react';

export function useShowControls() {
  const [showControls, setShowControls] = useState(false);
  
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTimeout(() => setShowControls(false), 3000);
  }, []);

  return {
    showControls,
    handleMouseMove,
    handleMouseLeave
  };
}
