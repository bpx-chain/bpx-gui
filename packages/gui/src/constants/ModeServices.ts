import { ServiceName } from '@bpx-chain/api';
import { Mode } from '@bpx-chain/core';

export default {
  [Mode.NODE]: [ServiceName.BEACON],
  [Mode.FARMING]: [ServiceName.BEACON, ServiceName.FARMER, ServiceName.HARVESTER],
};
