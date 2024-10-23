import { createApi } from '@reduxjs/toolkit/query/react';

import bpxLazyBaseQuery from './bpxLazyBaseQuery';

export const baseQuery = bpxLazyBaseQuery({});

export default createApi({
  reducerPath: 'bpxApi',
  baseQuery,
  endpoints: () => ({}),
});
