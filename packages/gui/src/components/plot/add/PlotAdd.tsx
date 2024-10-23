import { useGetPlottersQuery, useGetKeysQuery } from '@bpx-chain/api-react';
import React from 'react';
import { Suspender } from '@bpx-chain/core';

import PlotAddForm from './PlotAddForm';

export default function PlotAdd() {
  const { data: plotters, isLoading: isLoadingPlotters } = useGetPlottersQuery();
  const { data: fingerprints, isLoading: isLoadingPublicKeys, error, refetch } = useGetKeysQuery();

  const isLoading = isLoadingPlotters || isLoadingPublicKeys;

  if (isLoading) {
    return <Suspender />;
  }

  return <PlotAddForm plotters={plotters} fingerprints={fingerprints} />;
}
