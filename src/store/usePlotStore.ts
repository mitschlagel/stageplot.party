import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { PlotObject, StagePlot, InstrumentDef } from '../types';
import { savePlotToDb, loadPlotFromDb, listPlotsFromDb, deletePlotFromDb } from '../services/persistence';

interface PlotStore {
  // ── Canvas state ──
  objects: PlotObject[];
  selectedId: string | null;
  plotName: string;
  plotId: string;
  canvasSize: { width: number; height: number };

  // ── Object actions ──
  addObject: (def: InstrumentDef, x: number, y: number) => void;
  addTextObject: (x: number, y: number) => void;
  updateObject: (id: string, changes: Partial<PlotObject>) => void;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  duplicateObject: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;

  // ── Undo / Redo ──
  history: PlotObject[][];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // ── Plot management ──
  setPlotName: (name: string) => void;
  newPlot: () => void;
  savePlot: () => Promise<void>;
  loadPlot: (id: string) => Promise<void>;
  listPlots: () => Promise<StagePlot[]>;
  deletePlot: (id: string) => Promise<void>;
}

const INITIAL_CANVAS = { width: 1200, height: 800 };

function cloneObjects(objects: PlotObject[]): PlotObject[] {
  return JSON.parse(JSON.stringify(objects));
}

export const usePlotStore = create<PlotStore>((set, get) => ({
  objects: [],
  selectedId: null,
  plotName: 'Untitled Stage Plot',
  plotId: uuidv4(),
  canvasSize: INITIAL_CANVAS,

  history: [[]],
  historyIndex: 0,

  // ── Push current state to history (call before mutations) ──
  pushHistory: () => {
    const { objects, history, historyIndex } = get();
    const trimmed = history.slice(0, historyIndex + 1);
    trimmed.push(cloneObjects(objects));
    set({ history: trimmed, historyIndex: trimmed.length - 1 });
  },

  addObject: (def, x, y) => {
    get().pushHistory();
    const newObj: PlotObject = {
      id: uuidv4(),
      type: def.type,
      category: def.category,
      x,
      y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      label: def.displayName,
      locked: false,
      zIndex: get().objects.length,
    };
    set((state) => ({
      objects: [...state.objects, newObj],
      selectedId: newObj.id,
    }));
  },

  addTextObject: (x, y) => {
    get().pushHistory();
    const newObj: PlotObject = {
      id: uuidv4(),
      type: 'text',
      category: 'text-label',
      x,
      y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      label: 'Text',
      locked: false,
      zIndex: get().objects.length,
    };
    set((state) => ({
      objects: [...state.objects, newObj],
      selectedId: newObj.id,
    }));
  },

  updateObject: (id, changes) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...changes } : obj
      ),
    }));
  },

  removeObject: (id) => {
    get().pushHistory();
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  selectObject: (id) => set({ selectedId: id }),

  duplicateObject: (id) => {
    const obj = get().objects.find((o) => o.id === id);
    if (!obj) return;
    get().pushHistory();
    const dup: PlotObject = {
      ...obj,
      id: uuidv4(),
      x: obj.x + 20,
      y: obj.y + 20,
      zIndex: get().objects.length,
    };
    set((state) => ({
      objects: [...state.objects, dup],
      selectedId: dup.id,
    }));
  },

  bringForward: (id) => {
    set((state) => {
      const maxZ = Math.max(...state.objects.map((o) => o.zIndex));
      return {
        objects: state.objects.map((o) =>
          o.id === id ? { ...o, zIndex: maxZ + 1 } : o
        ),
      };
    });
  },

  sendBackward: (id) => {
    set((state) => {
      const minZ = Math.min(...state.objects.map((o) => o.zIndex));
      return {
        objects: state.objects.map((o) =>
          o.id === id ? { ...o, zIndex: minZ - 1 } : o
        ),
      };
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    set({
      objects: cloneObjects(history[newIndex]),
      historyIndex: newIndex,
      selectedId: null,
    });
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    set({
      objects: cloneObjects(history[newIndex]),
      historyIndex: newIndex,
      selectedId: null,
    });
  },

  setPlotName: (name) => set({ plotName: name }),

  newPlot: () => {
    set({
      objects: [],
      selectedId: null,
      plotName: 'Untitled Stage Plot',
      plotId: uuidv4(),
      history: [[]],
      historyIndex: 0,
    });
  },

  savePlot: async () => {
    const { plotId, plotName, canvasSize, objects } = get();
    const plot: StagePlot = {
      id: plotId,
      name: plotName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      canvasWidth: canvasSize.width,
      canvasHeight: canvasSize.height,
      objects: cloneObjects(objects),
    };
    await savePlotToDb(plot);
  },

  loadPlot: async (id) => {
    const plot = await loadPlotFromDb(id);
    if (!plot) return;
    set({
      plotId: plot.id,
      plotName: plot.name,
      canvasSize: { width: plot.canvasWidth, height: plot.canvasHeight },
      objects: plot.objects,
      selectedId: null,
      history: [cloneObjects(plot.objects)],
      historyIndex: 0,
    });
  },

  listPlots: async () => {
    return listPlotsFromDb();
  },

  deletePlot: async (id) => {
    await deletePlotFromDb(id);
  },
}));
