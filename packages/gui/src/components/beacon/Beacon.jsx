import { useGetLatestBlocksQuery, useGetUnfinishedBlockHeadersQuery } from '@bpx-chain/api-react';
import { FormatLargeNumber, Flex, Card, StateColor, Table, LayoutDashboardSub } from '@bpx-chain/core';
import { Status } from '@bpx-chain/icons';
import { Trans } from '@lingui/macro';
import { Box, Tooltip, Typography } from '@mui/material';
import { get } from 'lodash';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// import HelpIcon from '@mui/icons-material/Help';
import BeaconBlockSearch from './BeaconBlockSearch';
import BeaconConnections from './BeaconConnections';
import BeaconCards from './card/BeaconCards';

const cols = [
  {
    minWidth: '250px',
    field(row) {
      const { isFinished = false, headerHash, foliage } = row;

      const { foliageTransactionBlockHash } = foliage || {};

      const value = isFinished ? headerHash : <span>{foliageTransactionBlockHash}</span>;

      const color = isFinished ? StateColor.SUCCESS : StateColor.WARNING;

      const tooltip = isFinished ? <Trans>Finished</Trans> : <Trans>In Progress</Trans>;

      return (
        <Flex gap={1} alignItems="center">
          <Tooltip title={<span>{tooltip}</span>}>
            <Status color={color} />
          </Tooltip>
          <Tooltip title={<span>{value}</span>}>
            <Box textOverflow="ellipsis" overflow="hidden">
              {value}
            </Box>
          </Tooltip>
        </Flex>
      );
    },
    title: <Trans>Header Hash</Trans>,
  },
  {
    field(row) {
      const { isFinished, foliage, height } = row;

      const { height: foliageHeight } = foliage || {};

      if (!isFinished) {
        return (
          <i>
            <FormatLargeNumber value={foliageHeight} />
          </i>
        );
      }

      return <FormatLargeNumber value={height} />;
    },
    title: <Trans>Height</Trans>,
  },
  {
    field(row) {
      const { isFinished } = row;

      const timestamp = isFinished ? row.timestamp : get(row, 'foliageTransactionBlock.timestamp');

      return timestamp ? moment(timestamp * 1000).format('LLL') : '';
    },
    title: <Trans>Time Created</Trans>,
  },
  {
    field(row) {
      const { isFinished = false } = row;

      return isFinished ? <Trans>Finished</Trans> : <Trans>Unfinished</Trans>;
    },
    title: <Trans>State</Trans>,
  },
];

function BlocksCard() {
  const navigate = useNavigate();
  const { data: latestBlocks = [], isLoading } = useGetLatestBlocksQuery();
  const { data: unfinishedBlockHeaders = [] } = useGetUnfinishedBlockHeadersQuery();

  const rows = [
    ...unfinishedBlockHeaders,
    ...latestBlocks.map((row) => ({
      ...row,
      isFinished: true,
    })),
  ];

  function handleRowClick(event, row) {
    const { isFinished, headerHash } = row;

    if (isFinished && headerHash) {
      navigate(`block/${headerHash}`);
    }
  }

  return (
    <Card title={<Trans>Blocks</Trans>} titleVariant="h6" action={<BeaconBlockSearch />} transparent>
      <Table cols={cols} rows={rows} onRowClick={handleRowClick} isLoading={isLoading} />
    </Card>
  );
}

export default function Beacon() {
  return (
    <LayoutDashboardSub>
      <Flex flexDirection="column" gap={2}>
        <Typography variant="h5" gutterBottom>
          <Trans>Beacon Client</Trans>
        </Typography>
        <Flex flexDirection="column" gap={4}>
          <BeaconCards />
          <BlocksCard />
          <BeaconConnections />
        </Flex>
      </Flex>
    </LayoutDashboardSub>
  );
}
