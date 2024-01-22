import { useGetBlockchainStateQuery } from '@bpx-chain/api-react';

import BeaconState from '../constants/BeaconState';

export default function useBeaconState(): {
  isLoading: boolean;
  state?: BeaconState;
  error?: Error;
  ecConnected?: boolean;
  ecSynced?: boolean;
} {
  const {
    data: blockchainState,
    isLoading,
    error,
  } = useGetBlockchainStateQuery(
    {},
    {
      pollingInterval: 10_000,
    }
  );
  const blockchainSynced = blockchainState?.sync?.synced;
  const blockchainSynching = blockchainState?.sync?.syncMode;
  const ecConnected = blockchainState?.ecConn;
  const ecSynced = blockchainState?.sync?.ecSynced;

  let state: BeaconState;
  if (blockchainSynching) {
    state = BeaconState.SYNCHING;
  } else if (blockchainSynced) {
    state = BeaconState.SYNCED;
  } else {
    state = BeaconState.ERROR;
  }

  return {
    isLoading,
    state,
    error,
    ecConnected,
    ecSynced,
  };
}
