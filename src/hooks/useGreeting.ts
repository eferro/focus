
import { useState, useEffect } from 'react';

export function useGreeting(time: Date | null) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!time) return;
    
    const hours = time.getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting('Good morning.');
    } else if (hours >= 12 && hours < 18) {
      setGreeting('Good afternoon.');
    } else {
      setGreeting('Good evening.');
    }
  }, [time]);

  return greeting;
}
