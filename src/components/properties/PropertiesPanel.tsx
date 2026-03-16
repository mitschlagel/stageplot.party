import { usePlotStore } from '../../store/usePlotStore';

export default function PropertiesPanel() {
  const objects = usePlotStore((s) => s.objects);
  const selectedId = usePlotStore((s) => s.selectedId);
  const updateObject = usePlotStore((s) => s.updateObject);
  const removeObject = usePlotStore((s) => s.removeObject);
  const duplicateObject = usePlotStore((s) => s.duplicateObject);
  const bringForward = usePlotStore((s) => s.bringForward);
  const sendBackward = usePlotStore((s) => s.sendBackward);
  const pushHistory = usePlotStore((s) => s.pushHistory);

  const selected = selectedId
    ? objects.find((o) => o.id === selectedId)
    : null;

  if (!selected) {
    return (
      <div className="w-56 bg-white border-l border-gray-200 flex flex-col">
        <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Properties
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-400 text-center">
            Select an object to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    pushHistory();
    updateObject(selected.id, { [field]: value });
  };

  return (
    <div className="w-56 bg-white border-l border-gray-200 flex flex-col">
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Properties
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Label */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Label
          </label>
          <input
            type="text"
            value={selected.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              X
            </label>
            <input
              type="number"
              value={Math.round(selected.x)}
              onChange={(e) => handleChange('x', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Y
            </label>
            <input
              type="number"
              value={Math.round(selected.y)}
              onChange={(e) => handleChange('y', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Rotation ({Math.round(selected.rotation)}°)
          </label>
          <input
            type="range"
            min={0}
            max={360}
            value={selected.rotation}
            onChange={(e) => handleChange('rotation', Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Scale */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Scale X
            </label>
            <input
              type="number"
              step={0.1}
              min={0.1}
              max={5}
              value={selected.scaleX.toFixed(1)}
              onChange={(e) => handleChange('scaleX', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Scale Y
            </label>
            <input
              type="number"
              step={0.1}
              min={0.1}
              max={5}
              value={selected.scaleY.toFixed(1)}
              onChange={(e) => handleChange('scaleY', Number(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Lock toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="lock-toggle"
            checked={selected.locked}
            onChange={(e) => handleChange('locked', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="lock-toggle" className="text-sm text-gray-600">
            Lock position
          </label>
        </div>

        {/* Action buttons */}
        <div className="space-y-1.5 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => bringForward(selected.id)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
            >
              Bring Front
            </button>
            <button
              onClick={() => sendBackward(selected.id)}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors"
            >
              Send Back
            </button>
          </div>
          <button
            onClick={() => duplicateObject(selected.id)}
            className="w-full px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 rounded text-blue-600 transition-colors"
          >
            Duplicate
          </button>
          <button
            onClick={() => removeObject(selected.id)}
            className="w-full px-2 py-1 text-xs bg-red-50 hover:bg-red-100 rounded text-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
