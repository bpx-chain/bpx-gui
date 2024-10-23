import type { KeyData } from '@bpx-chain/api';
import {
  useDeleteAllKeysMutation,
  useGetKeysQuery,
} from '@bpx-chain/api-react';
import { Trans } from '@lingui/macro';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Alert, Typography, ListItemIcon } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Sortable from 'sortablejs';
import styled from 'styled-components';
import KeyAction from './KeyAction';

import {
  Button,
  ConfirmDialog,
  DropdownActions,
  Flex,
  Loading,
  MenuItem,
  More,
  TooltipIcon,
  useOpenDialog,
  useShowError,
  Table,
} from '@bpx-chain/core';

const cols = [
  {
    minWidth: '100px',
    field: 'fingerprint',
    tooltip: 'fingerprint',
    title: <Trans>Fingerprint</Trans>,
  },
  {
    minWidth: '100px',
    field: 'label',
    tooltip: 'label',
    title: <Trans>Label</Trans>,
  },
  {
    field: (keyData: KeyData) => <KeyAction keyData={keyData} />,
    title: <Trans>Action</Trans>,
  },
];

export default function PlotKeys() {
  const openDialog = useOpenDialog();
  const navigate = useNavigate();
  const [deleteAllKeys] = useDeleteAllKeysMutation();
  const { data: publicKeyFingerprints, isLoading: isLoadingPublicKeys, error, refetch } = useGetKeysQuery();
  const hasFingerprints = !!publicKeyFingerprints?.length;
  const showError = useShowError();

  async function handleDeleteAllKeys() {
    await openDialog(
      <ConfirmDialog
        title={<Trans>Delete all keys</Trans>}
        confirmTitle={<Trans>Delete</Trans>}
        cancelTitle={<Trans>Back</Trans>}
        confirmColor="danger"
        onConfirm={() => deleteAllKeys().unwrap()}
      >
        <Trans>
          Deleting all keys will permanently remove the keys from your computer, make sure you have backups. Are you
          sure you want to continue?
        </Trans>
      </ConfirmDialog>
    );
  }

  const NewKeyButtonGroup = (
    <Flex alignItems="right">
      <DropdownActions label={<Trans>Add key</Trans>} variant="contained">
        <MenuItem close onClick={() => navigate('/dashboard/plot/key-add')}>
          <Typography variant="inherit" noWrap>
            <Trans>Create New</Trans>
          </Typography>
        </MenuItem>
        <MenuItem close onClick={() => navigate('/dashboard/plot/key-import')}>
          <Typography variant="inherit" noWrap>
            <Trans>Import Existing</Trans>
          </Typography>
        </MenuItem>
      </DropdownActions>
      {hasFingerprints && (
        <Flex
          sx={{
            '> button': {
              width: '37px',
              height: '37px',
              marginLeft: '10px',
            },
          }}
        >
          <More>
            <MenuItem onClick={handleDeleteAllKeys} close>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                <Trans>Delete All Keys</Trans>
              </Typography>
            </MenuItem>
          </More>
        </Flex>
      )}
    </Flex>
  );

  function renderTopSection() {
    return (
      <Flex
        justifyContent="space-between"
        width="100%"
      >
        <Flex alignItems="left">
          <Typography variant="h6">
            <Trans>Plot Keys</Trans>
          </Typography>
        </Flex>
        {NewKeyButtonGroup}
      </Flex>
    );
  }

  return (
    <>
      <Flex flexDirection="column" alignItems="flex-start" gap={3}>
        {isLoadingPublicKeys ? (
          <Loading center>
            <Trans>Loading list of the keys</Trans>
          </Loading>
        ) : error ? (
          <Alert
            severity="error"
            action={
              <Button onClick={refetch} color="inherit" size="small">
                <Trans>Try Again</Trans>
              </Button>
            }
          >
            <Trans>Unable to load the list of the keys</Trans>
            &nbsp;
            <TooltipIcon>{error.message}</TooltipIcon>
          </Alert>
        ) : (
          <>
            {renderTopSection()}
            <Flex flexDirection="column" gap={2} alignItems="stretch" alignSelf="stretch">
              <Table cols={cols} rows={publicKeyFingerprints} />
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
}