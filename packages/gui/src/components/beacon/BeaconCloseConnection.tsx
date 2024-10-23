import { useCloseBeaconConnectionMutation } from '@bpx-chain/api-react';
import { ConfirmDialog, useOpenDialog } from '@bpx-chain/core';
import { Trans } from '@lingui/macro';
import React from 'react';

type Props = {
  nodeId: string;
  children: (props: { onClose: () => void }) => JSX.Element;
};

export default function BeaconCloseConnection(props: Props): JSX.Element {
  const { nodeId, children } = props;
  const openDialog = useOpenDialog();
  const [closeConnection] = useCloseBeaconConnectionMutation();

  async function handleClose() {
    await openDialog(
      <ConfirmDialog
        title={<Trans>Confirm Disconnect</Trans>}
        confirmTitle={<Trans>Disconnect</Trans>}
        confirmColor="danger"
        onConfirm={() =>
          closeConnection({
            nodeId,
          }).unwrap()
        }
      >
        <Trans>Are you sure you want to disconnect?</Trans>
      </ConfirmDialog>
    );
  }

  return children({
    onClose: handleClose,
  });
}
