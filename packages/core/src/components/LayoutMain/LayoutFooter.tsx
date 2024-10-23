import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

import guiPackageJson from '../../../package.json';
import useAppVersion from '../../hooks/useAppVersion';
import Flex from '../Flex';

const { productName } = guiPackageJson;

export default function LayoutFooter() {
  const { version } = useAppVersion();

  return (
    <Flex flexDirection="row" flexGrow={1} justifyContent="space-between">
      <Typography color="textSecondary" variant="body2">
        {productName} {version}
      </Typography>
    </Flex>
  );
}
