import { Grid } from '@mui/material';
import React from 'react';

import FarmCardExpectedTimeToWin from './FarmCardExpectedTimeToWin';
import FarmCardPlotCount from './FarmCardPlotCount';
import FarmCardStatus from './FarmCardStatus';
import FarmCardTotalNetworkSpace from './FarmCardTotalNetworkSpace';
import FarmCardTotalSizeOfPlots from './FarmCardTotalSizeOfPlots';

export default function FarmCards() {
  return (
    <div>
      <Grid spacing={2} alignItems="stretch" container>
        <Grid xs={12} sm={6} md={4} item>
          <FarmCardStatus />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <FarmCardPlotCount />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <FarmCardTotalSizeOfPlots />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <FarmCardTotalNetworkSpace />
        </Grid>
        <Grid xs={12} md={4} item>
          <FarmCardExpectedTimeToWin />
        </Grid>
      </Grid>
    </div>
  );
}
