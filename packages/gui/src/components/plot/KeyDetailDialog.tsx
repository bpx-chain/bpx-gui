import { useGetKeyQuery } from '@bpx-chain/api-react';
import { Trans } from '@lingui/macro';
import { Box, Button, Grid, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

import {
  AlertDialog,
  Flex,
  Loading,
} from '@bpx-chain/core';

const StyledTypographyDD = styled(Typography)`
  word-break: break-all;
`;

export type KeyDetailDialogProps = {
  fingerprint: number;
};

export default function KeyDetailDialog(props: KeyDetailDialogProps) {
  const { fingerprint, ...rest } = props;

  const { data: keyData, isLoading: isLoading } = useGetKeyQuery({
    fingerprint,
    includeSecrets: true,
  });

  if (isLoading) {
    return (
      <AlertDialog
        title={<Trans>Loading details</Trans>}
        confirmTitle={<Trans>Close</Trans>}
        confirmVariant="contained"
        {...rest}
      >
        <Loading center />
      </AlertDialog>
    );
  }

  const { label } = keyData;

  return (
    <AlertDialog
      title={
        <Flex flexDirection="column">
          <Typography variant="h6" noWrap>
            {label || <Trans>Unnamed key</Trans>}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {fingerprint}
          </Typography>
        </Flex>
      }
      confirmTitle={<Trans>Close</Trans>}
      confirmVariant="contained"
      {...rest}
    >
      <Flex flexDirection="column" gap={3}>
        <Grid
          container
          component="dl" // mount a Definition List
          spacing={2}
        >
          <Grid item>
            <Typography component="dt" variant="subtitle2">
              <Trans>Public Key</Trans>
            </Typography>
            <StyledTypographyDD component="dd" variant="body2" color="textSecondary">
              {keyData.publicKey}
            </StyledTypographyDD>
          </Grid>
          <Grid item>
            <Typography component="dt" variant="subtitle2">
              <Trans>Farmer Public Key</Trans>
            </Typography>
            <StyledTypographyDD component="dd" variant="body2" color="textSecondary">
              {keyData.farmerPk}
            </StyledTypographyDD>
          </Grid>
          <Grid item>
            <Typography component="dt" variant="subtitle2">
              <Trans>Pool Public Key</Trans>
            </Typography>
            <StyledTypographyDD component="dd" variant="body2" color="textSecondary">
              {keyData.poolPk}
            </StyledTypographyDD>
          </Grid>
          <Grid item>
            <Typography component="dt" variant="subtitle2">
              <Trans>Secret Key</Trans>
            </Typography>
            <StyledTypographyDD component="dd" variant="body2" color="textSecondary">
              {keyData.secrets.privateKey}
            </StyledTypographyDD>
          </Grid>
          <Grid item>
            <Typography component="dt" variant="subtitle2">
              <Trans>Seed Phrase</Trans>
            </Typography>
            <Typography component="dd" variant="body2" color="textSecondary">
              {keyData.secrets.mnemonic ? (
                keyData.secrets.mnemonic.join(' ')
              ) : (
                <Trans>No 24 word seed, since this key is imported.</Trans>
              )}
            </Typography>
          </Grid>
        </Grid>
        
        <Grid item />
      </Flex>
    </AlertDialog>
  );
}