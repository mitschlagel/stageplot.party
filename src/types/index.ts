export interface PlotObject {
  id: string;
  type: 'instrument' | 'furniture' | 'text';
  category: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  label: string;
  showLabel: boolean;
  locked: boolean;
  zIndex: number;
}

export interface StagePlot {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  canvasWidth: number;
  canvasHeight: number;
  objects: PlotObject[];
}

export interface InstrumentDef {
  category: string;
  displayName: string;
  type: 'instrument' | 'furniture';
  svgPath: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultShowLabel?: boolean;
}
