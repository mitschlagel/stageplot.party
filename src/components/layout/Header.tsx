import { useState } from 'react';
import Konva from 'konva';
import { usePlotStore } from '../../store/usePlotStore';
import { exportToPdf } from '../../services/pdfExport';
import SaveLoadModal from './SaveLoadModal';

interface HeaderProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export default function Header({ stageRef }: HeaderProps) {
  const plotName = usePlotStore((s) => s.plotName);
  const setPlotName = usePlotStore((s) => s.setPlotName);
  const savePlot = usePlotStore((s) => s.savePlot);
  const newPlot = usePlotStore((s) => s.newPlot);
  const undo = usePlotStore((s) => s.undo);
  const redo = usePlotStore((s) => s.redo);

  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await savePlot();
    setSaving(false);
  };

  const handleExportPdf = () => {
    exportToPdf(stageRef, plotName);
  };

  return (
    <>
      <header className="h-12 bg-white border-b border-gray-200 flex items-center px-3 gap-2 flex-shrink-0">
        {/* App title */}
        <div className="flex items-center gap-2 mr-4">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="font-semibold text-sm text-gray-800 hidden sm:inline">
            stageplot.party
          </span>
        </div>

        {/* Plot name - editable */}
        <input
          type="text"
          value={plotName}
          onChange={(e) => setPlotName(e.target.value)}
          className="px-2 py-1 text-sm border border-transparent hover:border-gray-300 focus:border-blue-500 rounded focus:outline-none bg-transparent min-w-0 w-48"
          placeholder="Untitled Stage Plot"
        />

        {/* Separator */}
        <div className="h-5 w-px bg-gray-200 mx-1" />

        {/* File actions */}
        <button
          onClick={newPlot}
          className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="New plot"
        >
          New
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
          title="Save plot (Ctrl+S)"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => setShowSaveLoad(true)}
          className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Open saved plots"
        >
          Open
        </button>

        <div className="h-5 w-px bg-gray-200 mx-1" />

        {/* Undo/Redo */}
        <button
          onClick={undo}
          className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        <button
          onClick={redo}
          className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          Redo
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Export */}
        <button
          onClick={handleExportPdf}
          className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors font-medium"
        >
          Export PDF
        </button>
      </header>

      {showSaveLoad && (
        <SaveLoadModal onClose={() => setShowSaveLoad(false)} />
      )}
    </>
  );
}
