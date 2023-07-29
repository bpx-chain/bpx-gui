import { Grid } from '@mui/material';
import React from 'react';

import BeaconCardExecution from './BeaconCardExecution';
import BeaconCardDifficulty from './BeaconCardDifficulty';
import BeaconCardNetworkName from './BeaconCardNetworkName';
import BeaconCardPeakHeight from './BeaconCardPeakHeight';
import BeaconCardPeakTime from './BeaconCardPeakTime';
import BeaconCardStatus from './BeaconCardStatus';
import BeaconCardTotalIterations from './BeaconCardTotalIterations';
import BeaconCardVDFSubSlotIterations from './BeaconCardVDFSubSlotIterations';
import BeaconEstimatedNetworkSpace from './BeaconEstimatedNetworkSpace';

export default function BeaconCards() {
  return (
    <div>
      <Grid spacing={2} alignItems="stretch" container>
        <Grid xs={12} sm={6} md={4} item>
          <BeaconCardStatus />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <BeaconCardExecution />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <BeaconCardNetworkName />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <BeaconCardPeakHeight />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <BeaconCardPeakTime />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <BeaconCardDifficulty />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <BeaconCardVDFSubSlotIterations />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <BeaconCardTotalIterations />
        </Grid>
        <Grid xs={12} md={4} item>
          <BeaconEstimatedNetworkSpace />
        </Grid>
      </Grid>
    </div>
  );
}
