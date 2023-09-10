import { useGetBlockchainStateQuery } from '@bpx-network/api-react';
import { FormatBytes, CardSimple } from '@bpx-network/core';
import { Trans } from '@lingui/macro';
import React from 'react';

export default function FarmCardTotalNetworkSpace() {
  const { data, isLoading, error } = useGetBlockchainStateQuery();
  const totalNetworkSpace = data?.space ?? 0;

  return (
    <CardSimple
      title={<Trans>Total Network Space</Trans>}
      value={
        !totalNetworkSpace.isZero() ? <FormatBytes value={totalNetworkSpace} precision={3} />
                                    : <Trans>Unknown</Trans>
      }
      description={<Trans>Best estimate over last 24 hours</Trans>}
      loading={isLoading}
      error={error}
    />
  );
}
