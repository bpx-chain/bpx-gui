import type { KeyData } from '@bpx-chain/api';
import { useDeleteKeyByFingerprintMutation } from '@bpx-chain/api-react';
import { Trans } from '@lingui/macro';
import { Delete as DeleteIcon, Visibility as VisibilityIcon, Edit as EditIcon } from '@mui/icons-material';
import { Box, Typography, ListItemIcon } from '@mui/material';
import React, { useCallback, useState } from 'react';
import {
  Flex,
  MenuItem,
  More,
  useOpenDialog,
  ConfirmDialog,
} from '@bpx-chain/core';
import KeyDetailDialog from './KeyDetailDialog';
import KeyRenameDialog from './KeyRenameDialog';

export type KeyActionProps = {
  keyData: KeyData;
};

export default function KeyAction(props: KeyActionProps) {
  const { keyData } = props;
  const { fingerprint } = keyData;
  const [deleteKey] = useDeleteKeyByFingerprintMutation();
  const openDialog = useOpenDialog();
  
  async function handleShowKey() {
    await openDialog(<KeyDetailDialog fingerprint={fingerprint} />);
  }

  async function handleRename() {
    await openDialog(<KeyRenameDialog keyData={keyData} />);
  }

  async function handleDeletePrivateKey() {
    await openDialog(
      <ConfirmDialog
        title={<Trans>Delete Key</Trans>}
        confirmTitle={<Trans>Delete</Trans>}
        confirmColor="danger"
        onConfirm={() => deleteKey({ fingerprint }).unwrap()}
      >
        <Trans>Are you sure you want to delete the key?</Trans>
      </ConfirmDialog>
    );
  }

  return (
    <More>
      <MenuItem onClick={handleRename} close>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <Typography variant="inherit" noWrap>
          <Trans>Rename</Trans>
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleShowKey} close>
        <ListItemIcon>
          <VisibilityIcon />
        </ListItemIcon>
        <Typography variant="inherit" noWrap>
          <Trans>Details</Trans>
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleDeletePrivateKey} close>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <Typography variant="inherit" noWrap>
          <Trans>Delete</Trans>
        </Typography>
      </MenuItem>
    </More>
  );
}
