import { type Shell } from 'electron';

import {
  Farming as FarmingIcon,
  Beacon as BeaconIcon,
} from '@bpx-chain/icons';
import { Trans } from '@lingui/macro';
import {
  WbSunny as WbSunnyIcon,
  NightsStay as NightsStayIcon,
} from '@mui/icons-material';
import { ButtonGroup } from '@mui/material';
import React, { type ReactNode } from 'react';

import Mode from '../../constants/Mode';
import useDarkMode from '../../hooks/useDarkMode';
import useMode from '../../hooks/useMode';
import useShowError from '../../hooks/useShowError';
import Button from '../Button';
import Flex from '../Flex';
import Link from '../Link';
import LocaleToggle from '../LocaleToggle';
import SettingsLabel from './SettingsLabel';

export type SettingsAppProps = {
  children?: ReactNode;
};

export default function SettingsApp(props: SettingsAppProps) {
  const { children } = props;

  const [mode, setMode] = useMode();
  const showError = useShowError();
  const { enable, disable, isDarkMode } = useDarkMode();

  function handleSetFarmingMode() {
    setMode(Mode.FARMING);
  }

  function handleSetNodeMode() {
    setMode(Mode.NODE);
  }

  return (
    <Flex flexDirection="column" gap={3}>
      <Flex flexDirection="column" gap={1}>
        <SettingsLabel>
          <Trans>Mode</Trans>
        </SettingsLabel>
        <ButtonGroup fullWidth>
          <Button
            startIcon={<FarmingIcon />}
            selected={mode === Mode.FARMING}
            onClick={handleSetFarmingMode}
            data-testid="SettingsApp-mode-farming"
          >
            <Trans>Farming</Trans>
          </Button>
          <Button
            startIcon={<BeaconIcon />}
            selected={mode === Mode.NODE}
            onClick={handleSetNodeMode}
            data-testid="SettingsApp-mode-node"
          >
            <Trans>Node</Trans>
          </Button>
        </ButtonGroup>
      </Flex>

      <Flex flexDirection="column" gap={1}>
        <SettingsLabel>
          <Trans>Appearance</Trans>
        </SettingsLabel>
        <ButtonGroup fullWidth>
          <Button
            startIcon={<WbSunnyIcon />}
            selected={!isDarkMode}
            onClick={() => disable()}
            data-testid="SettingsApp-appearance-light"
          >
            <Trans>Light</Trans>
          </Button>
          <Button
            startIcon={<NightsStayIcon />}
            selected={isDarkMode}
            onClick={() => enable()}
            data-testid="SettingsApp-appearance-dark"
          >
            <Trans>Dark</Trans>
          </Button>
        </ButtonGroup>
      </Flex>

      <Flex flexDirection="column" gap={1}>
        <SettingsLabel>
          <Trans>Language</Trans>
        </SettingsLabel>
        <LocaleToggle variant="outlined" />
      </Flex>

      {children}
    </Flex>
  );
}
