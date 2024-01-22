import { useGetBlockchainStateQuery } from '@bpx-chain/api-react';
import { FormatBytes, CardSimple } from '@bpx-chain/core';
import { Trans } from '@lingui/macro';
import React from 'react';

export default function FarmCardTotalNetworkSpace() {
  const { data, isLoading, error } = useGetBlockchainStateQuery();
  const value = data?.space;

  return (
    <CardSimple
      title={<Trans>Total Network Space</Trans>}
      value={
        value ? <FormatBytes value={value} precision={3} />
              : <Trans>Unknown</Trans>
      }
      description={<Trans>Best estimate over last 24 hours</Trans>}
      loading={isLoading}
      error={error}
    />
  );
}
