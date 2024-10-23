import { PlotterService } from '@bpx-chain/api';
import type { Plot } from '@bpx-chain/api';

import api, { baseQuery } from '../api';
import onCacheEntryAddedInvalidate from '../utils/onCacheEntryAddedInvalidate';

const apiWithTag = api.enhanceEndpoints({ addTagTypes: ['PlotQueue'] });

export const plotterApi = apiWithTag.injectEndpoints({
  endpoints: (build) => ({
    getPlotQueue: build.query<Plot[], {}>({
      query: () => ({
        command: 'getQueue',
        service: PlotterService,
      }),
      // transformResponse: (response: any) => response,
      onCacheEntryAdded: onCacheEntryAddedInvalidate(baseQuery, [
        {
          command: 'onQueueChanged',
          service: PlotterService,
          endpoint: () => plotterApi.endpoints.getPlotQueue,
        },
      ]),
    }),
  }),
});

export const {
  useGetPlotQueueQuery,
  // useStopPlottingMutation,
  // useStartPlottingMutation,
} = plotterApi;
