import type { PoolState } from '@bpx-chain/api';

import removeOldPoints from './removeOldPoints';

export default function normalizePoolState(poolState: PoolState): PoolState {
  return {
    ...poolState,
    pointsAcknowledged24h: removeOldPoints(poolState.pointsAcknowledged24h),
    pointsFound24h: removeOldPoints(poolState.pointsFound24h),
  };
}
