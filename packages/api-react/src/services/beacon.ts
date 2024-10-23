import { Beacon } from '@bpx-chain/api';
import type { Block, BlockRecord, BlockHeader, BlockchainState, BeaconConnection } from '@bpx-chain/api';

import api, { baseQuery } from '../api';
import onCacheEntryAddedInvalidate from '../utils/onCacheEntryAddedInvalidate';

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['BlockchainState', 'BeaconConnections'] });

export const beaconApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    beaconPing: build.query<boolean, {}>({
      query: () => ({
        command: 'ping',
        service: Beacon,
      }),
      transformResponse: (response: any) => response?.success,
    }),

    getBlockRecords: build.query<
      BlockRecord[],
      {
        start?: number;
        end?: number;
      }
    >({
      query: ({ start, end }) => ({
        command: 'getBlockRecords',
        service: Beacon,
        args: [start, end],
      }),
      transformResponse: (response: any) => response?.blockRecords,
    }),
    getUnfinishedBlockHeaders: build.query<BlockHeader[], undefined>({
      query: () => ({
        command: 'getUnfinishedBlockHeaders',
        service: Beacon,
      }),
      transformResponse: (response: any) => response?.headers,
      onCacheEntryAdded: onCacheEntryAddedInvalidate(baseQuery, [
        {
          command: 'onBlockchainState',
          service: Beacon,
          endpoint: () => beaconApi.endpoints.getUnfinishedBlockHeaders,
        },
      ]),
    }),
    getBlockchainState: build.query<BlockchainState, undefined>({
      query: () => ({
        command: 'getBlockchainState',
        service: Beacon,
      }),
      providesTags: ['BlockchainState'],
      transformResponse: (response: any) => response?.blockchainState,
      onCacheEntryAdded: onCacheEntryAddedInvalidate(baseQuery, [
        {
          command: 'onBlockchainState',
          service: Beacon,
          onUpdate: (draft, data) =>
            Object.assign(draft, {
              ...data.blockchainState,
            }),
        },
      ]),
    }),
    getBeaconConnections: build.query<BeaconConnection[], undefined>({
      query: () => ({
        command: 'getConnections',
        service: Beacon,
      }),
      transformResponse: (response: any) => response?.connections,
      providesTags: (connections) =>
        connections
          ? [
              ...connections.map(({ nodeId }) => ({ type: 'BeaconConnections', id: nodeId } as const)),
              { type: 'BeaconConnections', id: 'LIST' },
            ]
          : [{ type: 'BeaconConnections', id: 'LIST' }],
      onCacheEntryAdded: onCacheEntryAddedInvalidate(baseQuery, [
        {
          command: 'onConnections',
          service: Beacon,
          onUpdate: (draft, data) => {
            // empty base array
            draft.splice(0);

            // assign new items
            Object.assign(draft, data.connections);
          },
        },
      ]),
    }),
    openBeaconConnection: build.mutation<
      BeaconConnection,
      {
        host: string;
        port: number;
      }
    >({
      query: ({ host, port }) => ({
        command: 'openConnection',
        service: Beacon,
        args: [host, port],
      }),
      invalidatesTags: [{ type: 'BeaconConnections', id: 'LIST' }],
    }),
    closeBeaconConnection: build.mutation<
      BeaconConnection,
      {
        nodeId: string;
      }
    >({
      query: ({ nodeId }) => ({
        command: 'closeConnection',
        service: Beacon,
        args: [nodeId],
      }),
      invalidatesTags: (_result, _error, { nodeId }) => [
        { type: 'BeaconConnections', id: 'LIST' },
        { type: 'BeaconConnections', id: nodeId },
      ],
    }),
    getBlock: build.query<
      Block,
      {
        headerHash: string;
      }
    >({
      query: ({ headerHash }) => ({
        command: 'getBlock',
        service: Beacon,
        args: [headerHash],
      }),
      transformResponse: (response: any) => response?.block,
    }),
    getBlockRecord: build.query<
      BlockRecord,
      {
        headerHash: string;
      }
    >({
      query: ({ headerHash }) => ({
        command: 'getBlockRecord',
        service: Beacon,
        args: [headerHash],
      }),
      transformResponse: (response: any) => response?.blockRecord,
    }),
    getNetworkInfo: build.query<any, undefined>({
      query: () => ({
        command: 'getNetworkInfo',
        service: Beacon,
      }),
    }),
    getCoinbase: build.query<any, undefined>({
      query: () => ({
        command: 'getCoinbase',
        service: Beacon,
      }),
    }),
    setCoinbase: build.mutation<
      undefined,
      {
        coinbase: string;
      }
    >({
      query: ({ coinbase }) => ({
        command: 'setCoinbase',
        service: Beacon,
        args: [coinbase],
      }),
    }),
  }),
});

export const {
  useBeaconPingQuery,
  useGetBlockRecordsQuery,
  useGetUnfinishedBlockHeadersQuery,
  useGetBlockchainStateQuery,
  useGetBeaconConnectionsQuery,
  useOpenBeaconConnectionMutation,
  useCloseBeaconConnectionMutation,
  useGetBlockQuery,
  useGetBlockRecordQuery,
  useGetNetworkInfoQuery,
  useGetCoinbaseQuery,
  useSetCoinbaseMutation,
} = beaconApi;
