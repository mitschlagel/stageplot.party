import { Line } from 'react-konva';

interface GridLayerProps {
  width: number;
  height: number;
  gridSize?: number;
}

export default function GridLayer({ width, height, gridSize = 25 }: GridLayerProps) {
  const lines = [];

  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, 0, x, height]}
        stroke="#e5e7eb"
        strokeWidth={0.5}
        listening={false}
      />
    );
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[0, y, width, y]}
        stroke="#e5e7eb"
        strokeWidth={0.5}
        listening={false}
      />
    );
  }

  return <>{lines}</>;
}
