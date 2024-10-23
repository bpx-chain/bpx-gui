import { Flex, SideBarItem } from '@bpx-chain/core';
import {
  Farming as FarmingIcon,
  Beacon as BeaconIcon,
  Plots as PlotsIcon,
  Settings as SettingsIcon,
} from '@bpx-chain/icons';
import { Trans } from '@lingui/macro';
import { Box } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const StyledItemsContainer = styled(Flex)`
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  padding-top: ${({ theme }) => `${theme.spacing(5)}`};
`;

const StyledRoot = styled(Flex)`
  height: 100%;
  flex-direction: column;
`;

const StyledSideBarDivider = styled(Box)`
  height: 1px;
  background: radial-gradient(36.59% 100.8% at 50% 50%, rgba(0, 0, 0, 0.18) 99.54%, rgba(255, 255, 255, 0) 100%);
`;

const StyledSettingsContainer = styled(Box)`
  background-color: ${({ theme }) => theme.palette.background.paper};
`;

export type DashboardSideBarProps = {
  simple?: boolean;
};

export default function DashboardSideBar(props: DashboardSideBarProps) {
  const { simple = false } = props;

  return (
    <StyledRoot>
      <StyledItemsContainer>
        <SideBarItem
          to="/dashboard"
          icon={BeaconIcon}
          title={<Trans>Beacon</Trans>}
          data-testid="DashboardSideBar-beacon"
          end
        />
        
        {!simple && (
          <>
            <Box my={1}>
              <StyledSideBarDivider />
            </Box>

            <SideBarItem
              to="/dashboard/plot"
              icon={PlotsIcon}
              title={<Trans>Plots</Trans>}
              data-testid="DashboardSideBar-plots"
            />

            <SideBarItem
              to="/dashboard/farm"
              icon={FarmingIcon}
              title={<Trans>Farming</Trans>}
              data-testid="DashboardSideBar-farming"
            />
          </>
        )}
      </StyledItemsContainer>
      <StyledSettingsContainer>
        <SideBarItem
          to="/dashboard/settings/general"
          icon={SettingsIcon}
          title={<Trans>Settings</Trans>}
          data-testid="DashboardSideBar-settings"
        />
      </StyledSettingsContainer>
    </StyledRoot>
  );
}
