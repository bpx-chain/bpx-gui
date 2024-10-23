import { useGetBlockchainStateQuery } from '@bpx-chain/api-react';
import { FormatLargeNumber, CardSimple } from '@bpx-chain/core';
import { Trans } from '@lingui/macro';
import React from 'react';

export default function BeaconCardDifficulty() {
  const { data, isLoading, error } = useGetBlockchainStateQuery();
  const value = data?.difficulty;

  return (
    <CardSimple
      loading={isLoading}
      valueColor="textPrimary"
      title={<Trans>Difficulty</Trans>}
      value={<FormatLargeNumber value={value} />}
      error={error}
    />
  );
}
