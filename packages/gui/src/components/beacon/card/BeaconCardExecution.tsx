import { useGetBlockchainStateQuery } from '@bpx-chain/api-react';
import { CardSimple, StateColor } from '@bpx-chain/core';
import { Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

const StyledWarning = styled.span`
  color: ${StateColor.WARNING};
`;

function getData(conn, synced) {
  if (!conn) {
    return {
      value: <Trans>Offline</Trans>,
      color: 'error',
      tooltip: <Trans>Execution Client is not responding</Trans>,
    };
  }

  if (!synced) {
    return {
      value: (
        <StyledWarning>
          <Trans>Syncing</Trans>
        </StyledWarning>
      ),
      color: 'error',
      tooltip: (
        <Trans>Execution Client is syncing</Trans>
      ),
    };
  }
  return {
    value: <Trans>Synced</Trans>,
    color: 'primary',
    tooltip: <Trans>Execution Client is fully synced</Trans>,
  };
}

export default function BeaconCardExecution() {
  const {
    data: state,
    isLoading,
    error,
  } = useGetBlockchainStateQuery(
    {},
    {
      pollingInterval: 10_000,
    }
  );

  if (isLoading) {
    return <CardSimple loading title={<Trans>Execution Client</Trans>} />;
  }

  const { value, tooltip, color } = getData(state?.ecConn, state?.sync.ecSynced);

  return <CardSimple valueColor={color} title={<Trans>Execution Client</Trans>} tooltip={tooltip} value={value} error={error} />;
}
