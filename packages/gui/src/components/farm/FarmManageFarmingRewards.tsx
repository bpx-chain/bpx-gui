import { useSetCoinbaseMutation, useGetCoinbaseQuery } from '@bpx-chain/api-react';
import { Button, Flex, Form, TextField, Loading } from '@bpx-chain/core';
import { Trans } from '@lingui/macro';
import { Alert, Dialog, DialogActions, DialogTitle, DialogContent, Typography } from '@mui/material';
import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

const StyledTextField = styled(TextField)`
  min-width: 640px;
`;

type FormData = {
  coinbase: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function FarmManageFarmingRewards(props: Props) {
  const { onClose, open } = props;
  const [setCoinbase] = useSetCoinbaseMutation();
  const { data, isLoading } = useGetCoinbaseQuery();

  const [error, setError] = useState<Error | null>(null);
  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      coinbase: data?.coinbase ?? '',
    },
  });

  useEffect(() => {
    if (data) {
      methods.reset({
        coinbase: data.coinbase,
      });
    }
  }, [data, methods]);

  const {
    register,
    formState: { errors },
  } = methods;

  function handleClose() {
    onClose();
  }

  function handleDialogClose(event: any, reason: any) {
    if (reason !== 'backdropClick' || reason !== 'EscapeKeyDown') {
      onClose();
    }
  }

  function checkAddress(stringToCheck: string): boolean {
    return true;
  }

  async function handleSubmit(values: FormData) {
    const { coinbase } = values;
    setError(null);

    try {
      await setCoinbase({
        coinbase,
      }).unwrap();
      handleClose();
    } catch (err) {
      setError(err);
    }
  }

  return (
    <Dialog onClose={handleDialogClose} maxWidth="lg" aria-labelledby="manage-farming-rewards-title" open={open}>
      <Form methods={methods} onSubmit={handleSubmit}>
        <DialogTitle id="manage-farming-rewards-title">
          <Trans>Manage Your Farming Rewards Target Address</Trans>
        </DialogTitle>
        <DialogContent dividers>
          <Flex gap={2} flexDirection="column">
            {isLoading ? (
              <Loading center />
            ) : (
              <>
                {error && <Alert severity="error">{error.message}</Alert>}
                {errors.coinbase && errors.coinbase.type === 'required' && (
                  <Alert severity="error">
                    <Trans>Reward Address must not be empty.</Trans>
                  </Alert>
                )}
                {errors.coinbase && errors.coinbase.type === 'validate' && (
                  <Alert severity="error">
                    <Trans>Reward Address is not properly formatted.</Trans>
                  </Alert>
                )}
                <StyledTextField
                  label={<Trans>Reward Address</Trans>}
                  name="coinbase"
                  variant="filled"
                  inputProps={{ spellCheck: false }}
                  {...register('coinbase', {
                    required: true,
                    validate: checkAddress,
                  })}
                />
              </>
            )}
          </Flex>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            <Trans>Cancel</Trans>
          </Button>
          <Button type="submit" autoFocus color="primary">
            <Trans>Save</Trans>
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
