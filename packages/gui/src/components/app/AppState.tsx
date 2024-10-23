import { IpcRenderer } from 'electron';

import { ConnectionState, ServiceHumanName, ServiceName } from '@bpx-chain/api';
import {
  useCloseMutation,
  useGetStateQuery,
  useServices,
  useGetVersionQuery,
} from '@bpx-chain/api-react';
import {
  Flex,
  LayoutHero,
  LayoutLoading,
  Mode,
  useMode,
  useAppVersion,
} from '@bpx-chain/core';
import { Trans } from '@lingui/macro';
import { Typography, Collapse } from '@mui/material';
import isElectron from 'is-electron';
import React, { useState, useEffect, ReactNode, useMemo } from 'react';

import ModeServices from '../../constants/ModeServices';
import AppSelectMode from './AppSelectMode';
import AppVersionWarning from './AppVersionWarning';
import useIsMainnet from '../../hooks/useIsMainnet';

const ALL_SERVICES = [
  ServiceName.BEACON,
  ServiceName.FARMER,
  ServiceName.HARVESTER,
];

type Props = {
  children: ReactNode;
};

export default function AppState(props: Props) {
  const { children } = props;
  const [close] = useCloseMutation();
  const [closing, setClosing] = useState<boolean>(false);
  const { data: clientState = {}, isLoading: isClientStateLoading } = useGetStateQuery();
  const [mode] = useMode();
  const [versionDialog, setVersionDialog] = useState<boolean>(true);
  const [updatedWindowTitle, setUpdatedWindowTitle] = useState<boolean>(false);
  const { data: backendVersion } = useGetVersionQuery();
  const { version } = useAppVersion();
  const isMainnet = useIsMainnet();
  const isTestnet = isMainnet === undefined ? false : (isMainnet ? false : true);

  const runServices = useMemo<ServiceName[] | undefined>(() => {
    if (mode) {
      return ModeServices[mode];
    }

    return undefined;
  }, [mode]);

  const servicesState = useServices(ALL_SERVICES, {
    keepRunning: !closing ? runServices : [],
    disabled: false,
  });

  const allServicesRunning = useMemo<boolean>(() => {
    if (!runServices) {
      return false;
    }

    const specificRunningServiceStates = servicesState.running.filter((serviceState) =>
      runServices.includes(serviceState.service)
    );

    return specificRunningServiceStates.length === runServices.length;
  }, [servicesState, runServices]);

  const isConnected = !isClientStateLoading && clientState?.state === ConnectionState.CONNECTED;

  useEffect(() => {
    const allRunningServices = servicesState.running.map((serviceState) => serviceState.service);
    const nonNodeServiceRunning = allRunningServices.some((service) => service !== ServiceName.BEACON);

    if (mode === Mode.NODE && !nonNodeServiceRunning) {
      window.ipcRenderer.invoke('setPromptOnQuit', false);
    } else {
      window.ipcRenderer.invoke('setPromptOnQuit', true);
    }
  }, [mode, servicesState]);

  useEffect(() => {
    async function handleClose(event) {
      if (closing) {
        return;
      }

      setClosing(true);

      await close({
        force: true,
      }).unwrap();

      event.sender.send('daemon-exited');
    }

    if (isElectron()) {
      const { ipcRenderer } = window as unknown as { ipcRenderer: IpcRenderer };

      ipcRenderer.on('exit-daemon', handleClose);

      // Handle files/URLs opened at launch now that the app is ready
      ipcRenderer.invoke('processLaunchTasks');

      if (isTestnet && !updatedWindowTitle) {
        ipcRenderer.invoke('setWindowTitle', 'BPX Beacon Client (Testnet)');
        setUpdatedWindowTitle(true);
      }

      return () => {
        // @ts-ignore
        ipcRenderer.off('exit-daemon', handleClose);
      };
    }
    return undefined;
  }, [close, closing, isTestnet, updatedWindowTitle]);

  if (closing) {
    return (
      <LayoutLoading hideSettings>
        <Flex flexDirection="column" gap={2}>
          <Typography variant="body1" align="center">
            <Trans>Closing down services</Trans>
          </Typography>
          <Flex flexDirection="column" gap={0.5}>
            {ALL_SERVICES.filter((service) => !!clientState?.startedServices.includes(service)).map((service) => (
              <Collapse key={service} in timeout={{ enter: 0, exit: 1000 }}>
                <Typography variant="body1" color="textSecondary" align="center">
                  {ServiceHumanName[service]}
                </Typography>
              </Collapse>
            ))}
          </Flex>
        </Flex>
      </LayoutLoading>
    );
  }

  if (backendVersion && version && versionDialog === true) {
    // backendVersion can be in the format of 1.6.1, 1.7.0b3, or 1.7.0b3.dev123
    // version can be in the format of 1.6.1, 1.7.0b3, 1.7.0-b2.dev123, or 1.7.0b3-dev123

    const backendVersionClean = backendVersion.replace(/[-+.]/g, '');
    const guiVersionClean = version.replace(/[-+.]/g, '');

    if (backendVersionClean !== guiVersionClean && process.env.NODE_ENV !== 'development') {
      return (
        <LayoutHero>
          <AppVersionWarning backV={backendVersion} guiV={version} setVersionDialog={setVersionDialog} />
        </LayoutHero>
      );
    }
  }

  if (!isConnected) {
    const { attempt } = clientState;
    return (
      <LayoutLoading>
        {!attempt ? (
          <Typography variant="body1" align="center">
            <Trans>Connecting to daemon</Trans>
          </Typography>
        ) : (
          <Flex flexDirection="column" gap={1}>
            <Typography variant="body1" align="center">
              <Trans>Connecting to daemon</Trans>
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary">
              <Trans>Attempt {attempt}</Trans>
            </Typography>
          </Flex>
        )}
      </LayoutLoading>
    );
  }

  if (!mode) {
    return (
      <LayoutHero maxWidth="md">
        <AppSelectMode />
      </LayoutHero>
    );
  }

  if (!allServicesRunning) {
    return (
      <LayoutLoading>
        <Flex flexDirection="column" gap={2}>
          <Typography variant="body1" align="center">
            <Trans>Starting services</Trans>
          </Typography>
          <Flex flexDirection="column" gap={0.5}>
            {!!runServices &&
              runServices.map((service) => (
                <Collapse
                  key={service}
                  in={!servicesState.running.find((state) => state.service === service)}
                  timeout={{ enter: 0, exit: 1000 }}
                >
                  <Typography variant="body1" color="textSecondary" align="center">
                    {ServiceHumanName[service]}
                  </Typography>
                </Collapse>
              ))}
          </Flex>
        </Flex>
      </LayoutLoading>
    );
  }

  return <>{children}</>;
}
