type PlotAdd = {
  plotSize: number;
  plotCount: number;
  maxRam: number;
  numThreads: number;
  numBuckets: number;
  queue: string;
  finalLocation: string;
  workspaceLocation: string;
  workspaceLocation2: string;
  parallel: boolean;
  delay: number;
  disableBitfieldPlotting?: boolean;
  excludeFinalDir?: boolean;
  overrideK?: boolean;
  farmerPublicKey?: string;
  poolPublicKey?: string;
};

export default PlotAdd;
