import * as client from './client';
import * as fullNode from './fullNode';
import * as wallet from './wallet';

export const {
  clientApi,

  useCloseMutation,
} = client;

export const {
  fullNodeApi,

  useGetBlockRecordsQuery,
  useGetUnfinishedBlockHeadersQuery,
  useGetBlockchainStateQuery,
  useGetConnectionsQuery: useGetFullNodeConnectionsQuery,
  useGetBlockQuery,
  useGetBlockRecordQuery,
  useOpenConnectionMutation,
  useCloseConnectionMutation,
} = fullNode;

export const {
  walletApi,

  useGetWalletsQuery,
  useGetTransactionQuery,
  useGetPwStatusQuery,
  usePwAbsorbRewardsMutation,
  usePwJoinPoolMutation,
  usePwSelfPoolMutation,
  useCreateNewWalletMutation,
  useDeleteUnconfirmedTransactionsMutation,
  useGetWalletBalanceQuery,
  useGetFarmedAmountQuery,
  useSendTransactionMutation,
  useGenerateMnemonicMutation,
  useGetPublicKeysQuery,
  useAddKeyMutation,
  useDeleteKeyMutation,
  useCheckDeleteKeyMutation,
  useDeleteAllKeysMutation,
  useLogInMutation,
  useLogInAndSkipImportMutation,
  useLogInAndImportBackupMutation,
  useGetBackupInfoQuery,
  useGetBackupInfoByFingerprintQuery,
  useGetBackupInfoByWordsQuery,
  useGetPrivateKeyQuery,
  useGetTransactionsQuery,
  useGetCurrentAddressQuery,
  useGetNextAddressMutation,
  useFarmBlockMutation,
  useGetHeightInfoQuery,
  useGetNetworkInfoQuery,
  useGetSyncStatusQuery,
  useGetConnectionsQuery: useGetWalletConnectionsQuery,
  useCreateBackupMutation,
  // CAT
  useCreateNewCATWalletMutation,
  useCreateCATWalletForExistingMutation,
  useGetCATTailQuery,
  useGetCATNameQuery,
  useSetCATNameMutation,
  useSpendCATMutation,
  useAddCATTokenMutation,
} = wallet;
