import { useRef } from 'react';
import Konva from 'konva';
import Header from './components/layout/Header';
import InstrumentPalette from './components/palette/InstrumentPalette';
import CanvasArea from './components/canvas/CanvasArea';
import PropertiesPanel from './components/properties/PropertiesPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';

export default function App() {
  const stageRef = useRef<Konva.Stage | null>(null);

  useKeyboardShortcuts();
  useAutoSave();

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <Header stageRef={stageRef} />
      <div className="flex flex-1 overflow-hidden">
        <InstrumentPalette />
        <CanvasArea stageRef={stageRef} />
        <PropertiesPanel />
      </div>
    </div>
  );
}
