import { ServiceName } from '@bpx-network/api';
import { useService } from '@bpx-network/api-react';

import FarmerStatus from '../constants/FarmerStatus';
import BeaconState from '../constants/BeaconState';
import useBeaconState from './useBeaconState';

export default function useFarmerStatus(): FarmerStatus {
  const { state: beaconState, isLoading: isLoadingBeaconState, ecGood: ecGood } = useBeaconState();

  const { isRunning, isLoading: isLoadingIsRunning } = useService(ServiceName.FARMER);

  const isLoading = isLoadingIsRunning || isLoadingBeaconState;

  if (beaconState === BeaconState.SYNCHING) {
    return FarmerStatus.SYNCHING;
  }

  if (beaconState === BeaconState.ERROR || !ecGood) {
    return FarmerStatus.NOT_AVAILABLE;
  }

  if (isLoading /* || !farmerConnected */) {
    return FarmerStatus.NOT_CONNECTED;
  }

  if (!isRunning) {
    return FarmerStatus.NOT_RUNNING;
  }

  return FarmerStatus.FARMING;
}
