import { SettingsApp } from '@bpx-chain/core';
import { Grid } from '@mui/material';
import React from 'react';

export default function SettingsGeneral() {
  return (
    <Grid container>
      <Grid item xs={12} sm={6} lg={3}>
        <SettingsApp />
      </Grid>
    </Grid>
  );
}
