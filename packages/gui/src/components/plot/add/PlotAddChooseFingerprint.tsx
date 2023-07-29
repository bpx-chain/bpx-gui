import { CardStep, Select, StateColor, TextField } from '@bpx-network/core';
import { t, Trans } from '@lingui/macro';
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Typography } from '@mui/material';
import React from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  step: number;
  fingerprints: any;
};

export default function PlotAddChooseFingerprint(props: Props) {
  const { step, fingerprints } = props;
  const { watch, setValue } = useFormContext();

  const fp = watch('fingerprint');
  const manualSetup = (fp == null);
  
  console.log(fp);
  console.log(manualSetup);
  console.log(fingerprints);
  
  React.useEffect(() => {
    if(!manualSetup) {
        setValue('farmerPublicKey', fingerprints[fp].farmerPk);
        setValue('poolPublicKey', fingerprints[fp].poolPk);
    }
    else {
        setValue('farmerPublicKey', '');
        setValue('poolPublicKey', '');
    }
  }, [fp]);

  return (
    <CardStep step={step} title={<Trans>Choose Fingerprint</Trans>}>
      <Typography variant="subtitle1">
        <Trans>
          The created plots will be permamently associated with the selected key. If you lose access to this key,
          you won't be able to use these plots to farm BPX anymore.
        </Trans>
      </Typography>

      <Grid container>
        <Grid xs={12} sm={10} md={8} lg={6} space={2} item>
          <FormControl variant="filled" fullWidth>
            <InputLabel required focused>
              <Trans>Fingerprint</Trans>
            </InputLabel>
            <Select name="fingerprint">
              {fingerprints.map((fp) => (
                <MenuItem
                  value={fp.fingerprint}
                  key={fp.fingerprint}
                >
                  {fp.fingerprint}
                  {fp.label && (
                    <>
                      &nbsp;({fp.label})
                    </>
                  )}
                </MenuItem>
              ))}
              <MenuItem
                value={<Trans>Manual setup</Trans>}
                key={null}
              >
                <Trans>Manual setup</Trans>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} item>
          <FormControl variant="filled" fullWidth>
            <TextField
              name="farmerPublicKey"
              type="text"
              variant="filled"
              placeholder="Hex farmer public key"
              label={<Trans>Farmer Public Key</Trans>}
              disabled={!manualSetup}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} item>
          <FormControl variant="filled" fullWidth>
            <TextField
              name="poolPublicKey"
              type="text"
              variant="filled"
              placeholder="Hex public key of pool"
              label={<Trans>Pool Public Key</Trans>}
              disabled={!manualSetup}
            />
          </FormControl>
        </Grid>
      </Grid>
    </CardStep>
  );
}
