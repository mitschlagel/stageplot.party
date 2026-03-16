import { useEffect, useState } from 'react';
import { usePlotStore } from '../../store/usePlotStore';
import type { StagePlot } from '../../types';

interface SaveLoadModalProps {
  onClose: () => void;
}

export default function SaveLoadModal({ onClose }: SaveLoadModalProps) {
  const listPlots = usePlotStore((s) => s.listPlots);
  const loadPlot = usePlotStore((s) => s.loadPlot);
  const deletePlot = usePlotStore((s) => s.deletePlot);

  const [plots, setPlots] = useState<StagePlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    setLoading(true);
    const list = await listPlots();
    setPlots(list);
    setLoading(false);
  };

  const handleLoad = async (id: string) => {
    await loadPlot(id);
    onClose();
  };

  const handleDelete = async (id: string) => {
    await deletePlot(id);
    loadList();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-xl w-[28rem] max-h-[70vh] flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Saved Plots</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <p className="text-sm text-gray-400 text-center py-8">
              Loading...
            </p>
          )}
          {!loading && plots.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">
              No saved plots yet. Click "Save" to save your current plot.
            </p>
          )}
          {!loading &&
            plots.map((plot) => (
              <div
                key={plot.id}
                className="flex items-center justify-between py-2 px-2 rounded hover:bg-gray-50 group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {plot.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(plot.updatedAt).toLocaleDateString()} &middot;{' '}
                    {plot.objects.length} objects
                  </p>
                </div>
                <div className="flex gap-1.5 ml-2">
                  <button
                    onClick={() => handleLoad(plot.id)}
                    className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(plot.id)}
                    className="px-2 py-1 text-xs bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
