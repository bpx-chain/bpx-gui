import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import BpxIcon from './images/bpx.svg';

export default function Keys(props: SvgIconProps) {
  return <SvgIcon component={BpxIcon} viewBox="0 0 150 58" {...props} />;
}
