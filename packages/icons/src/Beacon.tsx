import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import BeaconIcon from './images/Beacon.svg';

export default function Beacon(props: SvgIconProps) {
  return <SvgIcon component={BeaconIcon} viewBox="0 0 32 32" {...props} />;
}
