import PlotQueueItem from '../@types/PlotQueueItem';
import type Client from '../Client';
import type Message from '../Message';
import ServiceName from '../constants/ServiceName';
import Service from './Service';
import type { Options } from './Service';

export default class Daemon extends Service {
  constructor(client: Client, options?: Options) {
    super(ServiceName.DAEMON, client, {
      skipAddService: true,
      ...options,
    });
  }

  registerService(service: string) {
    return this.command<{
      queue: [PlotQueueItem];
    }>('register_service', {
      service,
    });
  }

  startService(service: string, testing?: boolean) {
    return this.command('start_service', {
      service,
      testing: testing ? true : undefined,
    });
  }

  stopService(service: string) {
    return this.command('stop_service', {
      service,
    });
  }

  isRunning(service: string) {
    return this.command<{
      isRunning: boolean;
    }>('is_running', {
      service,
    });
  }

  runningServices() {
    return this.command('running_services');
  }

  addPrivateKey(mnemonic: string, label?: string) {
    return this.command('add_private_key', {
      mnemonic,
      label,
    });
  }

  getKey(fingerprint: string, includeSecrets?: boolean) {
    return this.command('get_key', {
      fingerprint,
      includeSecrets,
    });
  }

  getKeys(includeSecrets?: boolean) {
    return this.command('get_keys', {
      includeSecrets,
    });
  }

  setLabel(fingerprint: string, label: string) {
    return this.command('set_label', {
      fingerprint,
      label,
    });
  }

  deleteLabel(fingerprint: string) {
    return this.command('delete_label', {
      fingerprint,
    });
  }
  
  async generateMnemonic(): Promise<{
    mnemonic: string[];
    success: boolean;
  }> {
    return this.command('generate_mnemonic');
  }
  
  async deleteKeyByFingerprint(fingerprint: string) {
    return this.command('delete_key_by_fingerprint', {
      fingerprint,
    });
  }
  
  async deleteAllKeys() {
    return this.command('delete_all_keys');
  }

  keyringStatus() {
    return this.command('keyring_status');
  }

  getPlotters() {
    return this.command('get_plotters');
  }

  stopPlotting(id: string) {
    return this.command('stop_plotting', {
      id,
      service: ServiceName.PLOTTER,
    });
  }

  startPlotting(inputArgs: {
    bladebitDisableNUMA?: boolean;
    bladebitWarmStart?: boolean;
    bladebitNoCpuAffinity?: boolean;
    bladebitCompressionLevel?: number;
    bladebitDiskCache?: number;
    bladebitDiskF1Threads?: number;
    bladebitDiskFpThreads?: number;
    bladebitDiskCThreads?: number;
    bladebitDiskP2Threads?: number;
    bladebitDiskP3Threads?: number;
    bladebitDiskAlternate?: boolean;
    bladebitDiskNoT1Direct?: boolean;
    bladebitDiskNoT2Direct?: boolean;
    bladebitDeviceIndex?: number;
    bladebitEnableDisk128Mode?: boolean;
    bladebitEnableDisk16Mode?: boolean;
    delay: number;
    disableBitfieldPlotting?: boolean;
    excludeFinalDir?: boolean;
    farmerPublicKey?: string;
    finalLocation: string;
    fingerprint?: number;
    madmaxNumBucketsPhase3?: number;
    madmaxTempToggle?: boolean;
    madmaxThreadMultiplier?: number;
    maxRam: number;
    numBuckets: number;
    numThreads: number;
    overrideK?: boolean;
    parallel: boolean;
    plotCount: number;
    plotSize: number;
    plotterName: string;
    plotType?: string;
    poolPublicKey?: string;
    queue: string;
    workspaceLocation: string;
    workspaceLocation2: string;
  }) {
    const conversionDict: Record<string, string> = {
      bladebitDisableNUMA: 'm',
      bladebitWarmStart: 'w',
      bladebitNoCpuAffinity: 'no_cpu_affinity',
      bladebitCompressionLevel: 'compress',
      bladebitDiskCache: 'cache',
      bladebitDiskF1Threads: 'f1_threads',
      bladebitDiskFpThreads: 'fp_threads',
      bladebitDiskCThreads: 'c_threads',
      bladebitDiskP2Threads: 'p2_threads',
      bladebitDiskP3Threads: 'p3_threads',
      bladebitDiskAlternate: 'alternate',
      bladebitDiskNoT1Direct: 'no_t1_direct',
      bladebitDiskNoT2Direct: 'no_t2_direct',
      bladebitDeviceIndex: 'device',
      bladebitEnableDisk128Mode: 'disk_128',
      bladebitEnableDisk16Mode: 'disk_16',
      disableBitfieldPlotting: 'e',
      excludeFinalDir: 'x',
      farmerPublicKey: 'f',
      finalLocation: 'd',
      madmaxNumBucketsPhase3: 'v',
      madmaxTempToggle: 'G',
      madmaxThreadMultiplier: 'K',
      maxRam: 'b',
      numBuckets: 'u',
      numThreads: 'r',
      plotCount: 'n',
      plotSize: 'k',
      plotterName: 'plotter',
      plotType: 'plot_type',
      poolPublicKey: 'p',
      workspaceLocation: 't',
      workspaceLocation2: 't2',
    };

    const outputArgs: Record<string, unknown> = { service: ServiceName.PLOTTER };

    Object.keys(inputArgs).forEach((key) => {
      if (conversionDict[key]) outputArgs[conversionDict[key]] = inputArgs[key as keyof typeof inputArgs];
      else outputArgs[key] = inputArgs[key as keyof typeof inputArgs];
    });

    if (outputArgs.plotter && (outputArgs.plotter as string).startsWith('bladebit')) outputArgs.plotter = 'bladebit';
    if (outputArgs.cache) outputArgs.cache = `${outputArgs.cache}G`;

    Object.keys(outputArgs).forEach((key) => {
      if (outputArgs[key] === undefined) delete outputArgs[key];
      // if (outputArgs[key] === '') delete outputArgs[key];
    });

    // some keys must be provided as empty strings and some must not be provided at all
    if (outputArgs.p === '') delete outputArgs.p;
    if (outputArgs.t === '') delete outputArgs.t;
    if (outputArgs.t2 === '') delete outputArgs.t2;

    delete outputArgs.fingerprint; // Use farmer + pool pk instead

    return this.command('start_plotting', outputArgs, undefined, undefined, true);
  }

  exit() {
    return this.command('exit');
  }

  onKeyringStatusChanged(callback: (data: any, message: Message) => void, processData?: (data: any) => any) {
    return this.onStateChanged('keyring_status_changed', callback, processData);
  }

  getVersion() {
    return this.command('get_version');
  }
}
