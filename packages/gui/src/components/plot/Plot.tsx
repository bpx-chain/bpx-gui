import { Flex, LayoutDashboardSub } from '@bpx-chain/core';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import PlotAdd from './add/PlotAdd';
import PlotOverview from './overview/PlotOverview';
import KeyAdd from './KeyAdd';
import KeyImport from './KeyImport';

export default function Plot() {
  return (
    <LayoutDashboardSub>
      <Flex flexDirection="column" gap={3}>
        <Routes>
          <Route index element={<PlotOverview />} />
          <Route path="add" element={<PlotAdd />} />
          <Route path="key-add" element={<KeyAdd />} />
          <Route path="key-import" element={<KeyImport />} />
        </Routes>
      </Flex>
    </LayoutDashboardSub>
  );
}
