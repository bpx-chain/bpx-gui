import { Loading, State, StateIndicator } from '@bpx-chain/core';
import React from 'react';

import BeaconState from '../../constants/BeaconState';
import useBeaconState from '../../hooks/useBeaconState';

export type BeaconStateIndicatorProps = {
  color?: string;
};

export default function BeaconStateIndicator(props: BeaconStateIndicatorProps) {
  const { color } = props;
  const { state, isLoading } = useBeaconState();

  if (isLoading) {
    return <Loading size={14} />;
  }

  if (state === BeaconState.ERROR) {
    return <StateIndicator state={State.ERROR} color={color} indicator hideTitle />;
  }
  if (state === BeaconState.SYNCED) {
    return <StateIndicator state={State.SUCCESS} color={color} indicator hideTitle />;
  }
  if (state === BeaconState.SYNCHING) {
    return <StateIndicator state={State.WARNING} color={color} indicator hideTitle />;
  }

  return null;
}
