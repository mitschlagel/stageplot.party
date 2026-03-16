import { useRef, useEffect } from 'react';
import { Group, Image as KonvaImage, Text } from 'react-konva';
import Konva from 'konva';
import type { PlotObject } from '../../types';
import { getInstrumentDef } from '../../data/instrumentCatalog';
import { useImage } from '../../hooks/useImage';
import { usePlotStore } from '../../store/usePlotStore';

interface PlotObjectNodeProps {
  obj: PlotObject;
  isSelected: boolean;
  onSelect: () => void;
}

export default function PlotObjectNode({
  obj,
  isSelected,
  onSelect,
}: PlotObjectNodeProps) {
  const groupRef = useRef<Konva.Group>(null);
  const updateObject = usePlotStore((s) => s.updateObject);
  const pushHistory = usePlotStore((s) => s.pushHistory);

  const def = getInstrumentDef(obj.category);
  const svgPath = def?.svgPath || '';
  const image = useImage(svgPath);

  const width = def?.defaultWidth || 80;
  const height = def?.defaultHeight || 60;

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.setZIndex(
        Math.min(obj.zIndex, (groupRef.current.parent?.children?.length || 1) - 1)
      );
    }
  }, [obj.zIndex]);

  const handleDragStart = () => {
    if (obj.locked) return;
    pushHistory();
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (obj.locked) return;
    updateObject(obj.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = groupRef.current;
    if (!node) return;
    pushHistory();
    updateObject(obj.id, {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    });
  };

  if (obj.type === 'text') {
    return (
      <Group
        id={obj.id}
        ref={groupRef}
        x={obj.x}
        y={obj.y}
        rotation={obj.rotation}
        scaleX={obj.scaleX}
        scaleY={obj.scaleY}
        draggable={!obj.locked}
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        <Text
          text={obj.label}
          fontSize={16}
          fontFamily="system-ui, sans-serif"
          fill="#1e293b"
          padding={4}
        />
      </Group>
    );
  }

  return (
    <Group
      id={obj.id}
      ref={groupRef}
      x={obj.x}
      y={obj.y}
      rotation={obj.rotation}
      scaleX={obj.scaleX}
      scaleY={obj.scaleY}
      draggable={!obj.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      // Offset to center the object on its position
      offsetX={width / 2}
      offsetY={height / 2}
    >
      {image && (
        <KonvaImage image={image} width={width} height={height} />
      )}
      {/* Label below the instrument */}
      <Text
        text={obj.label}
        fontSize={11}
        fontFamily="system-ui, sans-serif"
        fill="#475569"
        width={width}
        align="center"
        y={height + 2}
        listening={false}
      />
      {/* Selection highlight */}
      {isSelected && !image && (
        <Text
          text={obj.label}
          fontSize={14}
          fontFamily="system-ui, sans-serif"
          fill="#1e293b"
          fontStyle="bold"
        />
      )}
    </Group>
  );
}
