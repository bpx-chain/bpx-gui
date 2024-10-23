import { Daemon, optionsForPlotter, defaultsForPlotter, PlotterName } from '@bpx-chain/api';
import type {
    Plotter,
    PlotterMap,
    KeyringStatus,
    ServiceName,
    KeyData
} from '@bpx-chain/api';

import api, { baseQuery } from '../api';
import onCacheEntryAddedInvalidate from '../utils/onCacheEntryAddedInvalidate';

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['KeyringStatus', 'ServiceRunning', 'DaemonKey', 'RunningServices'],
});

export const daemonApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    addPrivateKey: build.mutation<number, { mnemonic: string; label?: string }>({
      query: ({ mnemonic, label }) => ({
        command: 'addPrivateKey',
        service: Daemon,
        args: [mnemonic, label],
      }),
      transformResponse: (response: any) => response?.fingerprint,
      invalidatesTags: [{ type: 'DaemonKey', id: 'LIST' }],
    }),

    getKey: build.query<
      KeyData,
      {
        fingerprint: number;
        includeSecrets?: boolean;
      }
    >({
      query: ({ fingerprint, includeSecrets }) => ({
        command: 'getKey',
        service: Daemon,
        args: [fingerprint, includeSecrets],
      }),
      transformResponse: (response: any) => response?.key,
      providesTags: (key) => (key ? [{ type: 'DaemonKey', id: key.fingerprint }] : []),
    }),

    getKeys: build.query<
      KeyData[],
      {
        includeSecrets?: boolean;
      }
    >({
      query: ({ includeSecrets } = {}) => ({
        command: 'getKeys',
        service: Daemon,
        args: [includeSecrets],
      }),
      transformResponse: (response: any) => response?.keys,
      providesTags: (keys) =>
        keys
          ? [
              ...keys.map((key) => ({ type: 'DaemonKey', id: key.fingerprint } as const)),
              { type: 'DaemonKey', id: 'LIST' },
            ]
          : [{ type: 'DaemonKey', id: 'LIST' }],
    }),

    setLabel: build.mutation<
      boolean,
      {
        fingerprint: number;
        label: string;
      }
    >({
      query: ({ fingerprint, label }) => ({
        command: 'setLabel',
        service: Daemon,
        args: [fingerprint, label],
      }),
      invalidatesTags: () => ['DaemonKey'],
      transformResponse: (response: any) => response?.success,
    }),

    deleteLabel: build.mutation<
      boolean,
      {
        fingerprint: number;
      }
    >({
      query: ({ fingerprint }) => ({
        command: 'deleteLabel',
        service: Daemon,
        args: [fingerprint],
      }),
      invalidatesTags: () => ['DaemonKey'],
      transformResponse: (response: any) => response?.success,
    }),
    
    generateMnemonic: build.mutation<string[], undefined>({
      query: () => ({
        command: 'generateMnemonic',
        service: Daemon,
      }),
      transformResponse: (response: any) => response?.mnemonic,
    }),
    
    deleteKeyByFingerprint: build.mutation<
      any,
      {
        fingerprint: number;
      }
    >({
      query: ({ fingerprint }) => ({
        command: 'deleteKeyByFingerprint',
        service: Daemon,
        args: [fingerprint],
      }),
      invalidatesTags: (_result, _error, { fingerprint }) => [
        { type: 'Keys', id: fingerprint },
        { type: 'Keys', id: 'LIST' },
        { type: 'DaemonKey', id: fingerprint },
        { type: 'DaemonKey', id: 'LIST' },
      ],
    }),
    
    deleteAllKeys: build.mutation<any, undefined>({
      query: () => ({
        command: 'deleteAllKeys',
        service: Daemon,
      }),
      invalidatesTags: [
        { type: 'Keys', id: 'LIST' },
        { type: 'DaemonKey', id: 'LIST' },
      ],
    }),

    daemonPing: build.query<boolean, {}>({
      query: () => ({
        command: 'ping',
        service: Daemon,
      }),
      transformResponse: (response: any) => response?.success,
    }),

    getKeyringStatus: build.query<KeyringStatus, {}>({
      query: () => ({
        command: 'keyringStatus',
        service: Daemon,
      }),
      transformResponse: (response: any) => {
        const { status, ...rest } = response;

        return {
          ...rest,
        };
      },
      providesTags: ['KeyringStatus'],
      onCacheEntryAdded: onCacheEntryAddedInvalidate(baseQuery, [
        {
          command: 'onKeyringStatusChanged',
          service: Daemon,
          onUpdate: (draft, data) => {
            // empty base array
            draft.splice(0);

            const { status, ...rest } = data;

            // assign new items
            Object.assign(draft, rest);
          },
        },
      ]),
    }),

    startService: build.mutation<
      boolean,
      {
        service: ServiceName;
        testing?: boolean;
      }
    >({
      query: ({ service, testing }) => ({
        command: 'startService',
        service: Daemon,
        args: [service, testing],
      }),
    }),

    stopService: build.mutation<
      boolean,
      {
        service: ServiceName;
      }
    >({
      query: ({ service }) => ({
        command: 'stopService',
        service: Daemon,
        args: [service],
      }),
    }),

    isServiceRunning: build.query<
      KeyringStatus,
      {
        service: ServiceName;
      }
    >({
      query: ({ service }) => ({
        command: 'isRunning',
        service: Daemon,
        args: [service],
      }),
      transformResponse: (response: any) => response?.isRunning,
      providesTags: (_result, _err, { service }) => [{ type: 'ServiceRunning', id: service }],
    }),

    runningServices: build.query<KeyringStatus, {}>({
      query: () => ({
        command: 'runningServices',
        service: Daemon,
      }),
      transformResponse: (response: any) => response?.runningServices,
      providesTags: [{ type: 'RunningServices', id: 'LIST' }],
    }),

    getPlotters: build.query<Object, undefined>({
      query: () => ({
        command: 'getPlotters',
        service: Daemon,
      }),
      transformResponse: (response: any) => {
        const { plotters } = response;
        const plotterNames = Object.keys(plotters) as PlotterName[];
        const availablePlotters: PlotterMap<PlotterName, Plotter> = {};

        plotterNames.forEach((plotterName) => {
          const {
            displayName = plotterName,
            version,
            installed,
            canInstall,
            bladebitMemoryWarning,
            cudaSupport,
          } = plotters[plotterName];

          if (!plotterName.startsWith('bladebit')) {
            availablePlotters[plotterName] = {
              displayName,
              version,
              options: optionsForPlotter(plotterName),
              defaults: defaultsForPlotter(plotterName),
              installInfo: {
                installed,
                canInstall,
                bladebitMemoryWarning,
              },
            };
            return;
          }

          // if (plotterName.startsWith('bladebit'))
          const majorVersion = typeof version === 'string' ? +version.split('.')[0] : 0;
          if (majorVersion <= 1) {
            const bbRam = PlotterName.BLADEBIT_RAM;
            availablePlotters[bbRam] = {
              displayName,
              version: typeof version === 'string' ? `${version} (RAM plot)` : version,
              options: optionsForPlotter(bbRam),
              defaults: defaultsForPlotter(bbRam),
              installInfo: {
                installed,
                canInstall,
                bladebitMemoryWarning,
              },
            };
            return;
          }
          const bbDisk = PlotterName.BLADEBIT_DISK;
          availablePlotters[bbDisk] = {
            displayName,
            version: `${version} (Disk plot)`,
            options: optionsForPlotter(bbDisk),
            defaults: defaultsForPlotter(bbDisk),
            installInfo: {
              installed,
              canInstall,
              bladebitMemoryWarning,
            },
          };

          const bbRam = PlotterName.BLADEBIT_RAM;
          availablePlotters[bbRam] = {
            displayName,
            version: `${version} (RAM plot)`,
            options: optionsForPlotter(bbRam),
            defaults: defaultsForPlotter(bbRam),
            installInfo: {
              installed,
              canInstall,
              bladebitMemoryWarning,
            },
          };
          if (cudaSupport) {
            const bbCuda = PlotterName.BLADEBIT_CUDA;
            availablePlotters[bbCuda] = {
              displayName,
              version: `${version} (CUDA plot)`,
              options: optionsForPlotter(bbCuda),
              defaults: defaultsForPlotter(bbCuda),
              installInfo: {
                installed,
                canInstall,
                bladebitMemoryWarning,
                cudaSupport,
              },
            };
          }
        });

        return availablePlotters;
      },
    }),

    stopPlotting: build.mutation<
      boolean,
      {
        id: string;
      }
    >({
      query: ({ id }) => ({
        command: 'stopPlotting',
        service: Daemon,
        args: [id],
      }),
      transformResponse: (response: any) => response?.success,
      // providesTags: (_result, _err, { service }) => [{ type: 'ServiceRunning', id: service }],
    }),
    
    startPlotting: build.mutation<
      boolean,
      {
        plotAddConfig: PlotAdd;
      }
    >({
      query: ({ plotAddConfig }) => ({
        command: 'startPlotting',
        service: Daemon,
        args: [plotAddConfig],
      }),
      transformResponse: (response: any) => response?.success,
      // providesTags: (_result, _err, { service }) => [{ type: 'ServiceRunning', id: service }],
    }),
    getVersion: build.query<string, {}>({
      query: () => ({
        command: 'getVersion',
        service: Daemon,
      }),
      transformResponse: (response: any) => response?.version,
    }),
  }),
});

export const {
  useDaemonPingQuery,
  useGetKeyringStatusQuery,
  useStartServiceMutation,
  useStopServiceMutation,
  useIsServiceRunningQuery,
  useRunningServicesQuery,
  useGetVersionQuery,

  useGetPlottersQuery,
  useStopPlottingMutation,
  useStartPlottingMutation,

  useAddPrivateKeyMutation,
  useGetKeyQuery,
  useGetKeysQuery,
  useSetLabelMutation,
  useDeleteLabelMutation,
  useGenerateMnemonicMutation,
  useDeleteKeyByFingerprintMutation,
  useDeleteAllKeysMutation,
} = daemonApi;
