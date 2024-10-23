import type { IpcRenderer } from 'electron';

type WindowExt = typeof window & {
  preferences: Record<string, any>;
  ipcRenderer: IpcRenderer;
};

export default async function initPrefs(onInitCallback: Function) {
  const w = window as WindowExt;
  w.preferences = await w.ipcRenderer.invoke('readPrefs');
  onInitCallback();
}
