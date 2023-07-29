import { useGetBlockchainStateQuery } from '@bpx-network/api-react';
import { CardSimple, StateColor } from '@bpx-network/core';
import { Trans } from '@lingui/macro';
import React from 'react';
import styled from 'styled-components';

const StyledWarning = styled.span`
  color: ${StateColor.WARNING};
`;

function getData(conn, synced) {
  if (!conn) {
    return {
      value: <Trans>Not connected</Trans>,
      color: 'error',
      tooltip: <Trans>Execution Client is not connected</Trans>,
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
        <Trans>Execution Client is still syncing</Trans>
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

  const { value, tooltip, color } = getData(state?.sync);

  return <CardSimple valueColor={color} title={<Trans>Execution Client</Trans>} tooltip={tooltip} value={value} error={error} />;
}
