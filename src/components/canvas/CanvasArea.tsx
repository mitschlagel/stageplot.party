import { useRef, useEffect, useCallback, useState } from 'react';
import { Stage, Layer, Transformer, Rect } from 'react-konva';
import Konva from 'konva';
import { usePlotStore } from '../../store/usePlotStore';
import { getInstrumentDef } from '../../data/instrumentCatalog';
import GridLayer from './GridLayer';
import PlotObjectNode from './PlotObjectNode';

interface CanvasAreaProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export default function CanvasArea({ stageRef }: CanvasAreaProps) {
  const objects = usePlotStore((s) => s.objects);
  const selectedId = usePlotStore((s) => s.selectedId);
  const selectObject = usePlotStore((s) => s.selectObject);
  const addObject = usePlotStore((s) => s.addObject);
  const canvasSize = usePlotStore((s) => s.canvasSize);

  const transformerRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // Sort objects by zIndex for rendering order
  const sortedObjects = [...objects].sort((a, b) => a.zIndex - b.zIndex);

  // Resize observer to fit canvas in container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Compute scale to fit canvas in container
  const scaleX = containerSize.width / canvasSize.width;
  const scaleY = containerSize.height / canvasSize.height;
  const scale = Math.min(scaleX, scaleY, 1); // Don't zoom beyond 1:1

  // Update transformer when selection changes
  useEffect(() => {
    const tr = transformerRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;

    if (selectedId) {
      const selectedNode = stage.findOne(`#${selectedId}`);
      if (selectedNode) {
        tr.nodes([selectedNode]);
        tr.getLayer()?.batchDraw();
        return;
      }
    }
    tr.nodes([]);
    tr.getLayer()?.batchDraw();
  }, [selectedId, stageRef, objects]);

  // Handle click on empty area to deselect
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (e.target === e.currentTarget || e.target.getClassName() === 'Rect') {
        // Clicked on background
        const targetId = e.target.id();
        if (!targetId || targetId === 'canvas-bg') {
          selectObject(null);
        }
      }
    },
    [selectObject]
  );

  // Handle drop from palette
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const category = e.dataTransfer.getData('instrument-category');
      if (!category) return;

      const def = getInstrumentDef(category);
      if (!def) return;

      const stage = stageRef.current;
      if (!stage) return;

      // Get position relative to stage
      const stageBox = stage.container().getBoundingClientRect();
      const x = (e.clientX - stageBox.left) / scale;
      const y = (e.clientY - stageBox.top) / scale;

      addObject(def, x, y);
    },
    [addObject, stageRef, scale]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-gray-100 overflow-hidden relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Stage
        ref={stageRef}
        width={canvasSize.width * scale}
        height={canvasSize.height * scale}
        scaleX={scale}
        scaleY={scale}
        onClick={handleStageClick}
        onTap={handleStageClick}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Grid layer */}
        <Layer listening={false}>
          <Rect
            id="canvas-bg"
            x={0}
            y={0}
            width={canvasSize.width}
            height={canvasSize.height}
            fill="#ffffff"
          />
          <GridLayer width={canvasSize.width} height={canvasSize.height} />
        </Layer>

        {/* Objects layer */}
        <Layer>
          {sortedObjects.map((obj) => (
            <PlotObjectNode
              key={obj.id}
              obj={obj}
              isSelected={selectedId === obj.id}
              onSelect={() => selectObject(obj.id)}
            />
          ))}

          {/* Transformer for resize/rotate */}
          <Transformer
            ref={transformerRef}
            rotateEnabled={true}
            enabledAnchors={[
              'top-left',
              'top-right',
              'bottom-left',
              'bottom-right',
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              // Minimum size limit
              if (newBox.width < 20 || newBox.height < 20) return oldBox;
              return newBox;
            }}
          />
        </Layer>
      </Stage>

      {/* "Audience" label at bottom */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-400 tracking-widest uppercase pointer-events-none">
        Audience
      </div>
    </div>
  );
}
