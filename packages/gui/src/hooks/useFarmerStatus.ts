import { ServiceName } from '@bpx-chain/api';
import { useService } from '@bpx-chain/api-react';

import FarmerStatus from '../constants/FarmerStatus';
import BeaconState from '../constants/BeaconState';
import useBeaconState from './useBeaconState';

export default function useFarmerStatus(): FarmerStatus {
  const {
    state: beaconState,
    isLoading: isLoadingBeaconState,
    ecConnected: ecConnected,
    ecSynced: ecSynced,
  } = useBeaconState();

  const { isRunning, isLoading: isLoadingIsRunning } = useService(ServiceName.FARMER);

  const isLoading = isLoadingIsRunning || isLoadingBeaconState;

  if (beaconState === BeaconState.ERROR || !ecConnected) {
    return FarmerStatus.NOT_AVAILABLE;
  }
  
  if (beaconState === BeaconState.SYNCHING || !ecSynced) {
    return FarmerStatus.SYNCHING;
  }

  if (isLoading /* || !farmerConnected */) {
    return FarmerStatus.NOT_CONNECTED;
  }

  if (!isRunning) {
    return FarmerStatus.NOT_RUNNING;
  }

  return FarmerStatus.FARMING;
}
