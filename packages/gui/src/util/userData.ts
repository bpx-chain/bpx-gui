import { app } from 'electron';
import path from 'path';

import { getConfigRootDir } from './loadConfig';

export function getUserDataDir(): string {
  const bpxRootPath = getConfigRootDir();
  const appName = app.getName();
  const userDataDir = path.join(bpxRootPath, 'gui', appName);
  return userDataDir;
}

export function setUserDataDir(): void {
  const bpxRootUserDataPath = getUserDataDir();

  console.info(`Setting user data directory to ${bpxRootUserDataPath}`);
  app.setPath('userData', bpxRootUserDataPath);
}
