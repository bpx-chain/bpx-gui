type HarvesterConfig = {
  useGpuHarvesting: boolean | null;
  gpuIndex: number | null;
  enforceGpuIndex: boolean | null;
  disableCpuAffinity: boolean | null;
  parallelDecompressorCount: number | null;
  decompressorThreadCount: number | null;
  recursivePlotScan: boolean | null;
  refreshParameterIntervalSeconds: number | null;
};

export default HarvesterConfig;
