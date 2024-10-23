import { useGetLatestPeakTimestampQuery } from '@bpx-chain/api-react';
import { CardSimple } from '@bpx-chain/core';
import { Trans } from '@lingui/macro';
import moment from 'moment';
import React from 'react';

export default function BeaconCardPeakTime() {
  const { data: timestamp, isLoading, error } = useGetLatestPeakTimestampQuery();

  const value = timestamp ? moment(timestamp * 1000).format('LLL') : '';

  return (
    <CardSimple
      loading={isLoading}
      valueColor="textPrimary"
      title={<Trans>Last Block Time</Trans>}
      tooltip={<Trans>This is the timestamp of the most recent block.</Trans>}
      value={value}
      error={error}
    />
  );
}
