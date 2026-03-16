import { useEffect } from 'react';
import { usePlotStore } from '../store/usePlotStore';

export function useKeyboardShortcuts() {
  const { selectedId, removeObject, duplicateObject, undo, redo } =
    usePlotStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMeta = e.metaKey || e.ctrlKey;

      // Delete / Backspace → remove selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        removeObject(selectedId);
      }

      // Cmd+Z → undo
      if (isMeta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Cmd+Shift+Z → redo
      if (isMeta && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }

      // Cmd+Y → redo (alt)
      if (isMeta && e.key === 'y') {
        e.preventDefault();
        redo();
      }

      // Cmd+D → duplicate
      if (isMeta && e.key === 'd' && selectedId) {
        e.preventDefault();
        duplicateObject(selectedId);
      }

      // Escape → deselect
      if (e.key === 'Escape') {
        usePlotStore.getState().selectObject(null);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedId, removeObject, duplicateObject, undo, redo]);
}
