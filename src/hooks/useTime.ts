
import { useCallback } from 'react';

export function useTime(time: Date | null) {
  const formatTime = useCallback(() => {
    if (!time) return '--:--';
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }, [time]);

  return formatTime;
}
