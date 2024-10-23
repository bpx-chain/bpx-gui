import { t, Trans } from '@lingui/macro';
import { ExitToApp as ExitToAppIcon, Edit as EditIcon } from '@mui/icons-material';
import { Box, Drawer, Container, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { type ReactNode, useState, Suspense, useCallback } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Flex from '../Flex';
import Loading from '../Loading';
import Logo from '../Logo';
import Settings from '../Settings';
import Tooltip from '../Tooltip';
// import LayoutFooter from '../LayoutMain/LayoutFooter';

const StyledRoot = styled(Flex)`
  height: 100%;
  // overflow: hidden;
`;

const StyledDrawer = styled(Drawer)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 2};
  width: ${({ theme }) => theme.drawer.width};
  flex-shrink: 0;

  > div {
    width: ${({ theme }) => theme.drawer.width};
    // border-width: 0px;
  }
`;

const StyledBody = styled(Flex)`
  min-width: 0;
`;

export type LayoutDashboardProps = {
  children?: ReactNode;
  sidebar?: ReactNode;
  outlet?: boolean;
};

export default function LayoutDashboard(props: LayoutDashboardProps) {
  const { children, sidebar, outlet = false } = props;

  return (
    <StyledRoot>
      <Suspense fallback={<Loading center />}>
        {sidebar && (
          <StyledDrawer variant="permanent">{sidebar}</StyledDrawer>
        )}

        <StyledBody flexDirection="column" flexGrow={1}>
          <Flex flexDirection="column" gap={2} flexGrow={1} overflow="auto">
            <Suspense fallback={<Loading center />}>{outlet ? <Outlet /> : children}</Suspense>
          </Flex>
        </StyledBody>
      </Suspense>
    </StyledRoot>
  );
}
