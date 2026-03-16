import { useEffect, useRef } from 'react';
import { usePlotStore } from '../store/usePlotStore';

/**
 * Auto-save the current plot to IndexedDB every 30 seconds if there are objects.
 */
export function useAutoSave() {
  const savePlot = usePlotStore((s) => s.savePlot);
  const objects = usePlotStore((s) => s.objects);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (objects.length > 0) {
        savePlot();
      }
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [savePlot, objects.length]);
}
