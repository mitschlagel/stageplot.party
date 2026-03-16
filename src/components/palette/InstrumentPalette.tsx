import { instrumentCatalog } from '../../data/instrumentCatalog';
import type { InstrumentDef } from '../../types';
import { usePlotStore } from '../../store/usePlotStore';

function PaletteItem({ def }: { def: InstrumentDef }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('instrument-category', def.category);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-2 px-2 py-1.5 rounded cursor-grab hover:bg-gray-100 active:cursor-grabbing text-sm border border-transparent hover:border-gray-200 transition-colors"
      title={`Drag to add ${def.displayName}`}
    >
      <img
        src={def.svgPath}
        alt={def.displayName}
        className="w-8 h-6 object-contain flex-shrink-0"
        draggable={false}
      />
      <span className="truncate text-gray-700">{def.displayName}</span>
    </div>
  );
}

export default function InstrumentPalette() {
  const addTextObject = usePlotStore((s) => s.addTextObject);
  const instruments = instrumentCatalog.filter((i) => i.type === 'instrument');
  const furniture = instrumentCatalog.filter((i) => i.type === 'furniture');

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Instruments
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-1.5">
        {/* Instruments */}
        <div className="mb-3">
          <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Pitched & Drums
          </div>
          {instruments.map((def) => (
            <PaletteItem key={def.category} def={def} />
          ))}
        </div>

        {/* Furniture */}
        <div className="mb-3">
          <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Furniture
          </div>
          {furniture.map((def) => (
            <PaletteItem key={def.category} def={def} />
          ))}
        </div>

        {/* Text tool */}
        <div>
          <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Labels
          </div>
          <button
            onClick={() => addTextObject(600, 400)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 text-sm text-gray-700 border border-transparent hover:border-gray-200 transition-colors text-left"
          >
            <span className="w-8 h-6 flex items-center justify-center text-gray-400 text-lg flex-shrink-0">
              T
            </span>
            <span>Add Text Label</span>
          </button>
        </div>
      </div>
    </div>
  );
}
