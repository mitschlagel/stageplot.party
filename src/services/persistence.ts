import { get, set, del, keys, createStore } from 'idb-keyval';
import type { StagePlot } from '../types';

const plotStore = createStore('stageplot-party-db', 'plots');

export async function savePlotToDb(plot: StagePlot): Promise<void> {
  plot.updatedAt = Date.now();
  await set(plot.id, plot, plotStore);
}

export async function loadPlotFromDb(id: string): Promise<StagePlot | undefined> {
  return get<StagePlot>(id, plotStore);
}

export async function listPlotsFromDb(): Promise<StagePlot[]> {
  const allKeys = await keys(plotStore);
  const plots: StagePlot[] = [];
  for (const key of allKeys) {
    const plot = await get<StagePlot>(key as string, plotStore);
    if (plot) plots.push(plot);
  }
  return plots.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deletePlotFromDb(id: string): Promise<void> {
  await del(id, plotStore);
}
