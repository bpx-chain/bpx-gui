type Foliage = {
  foliage_transaction_block_hash: string;
  foliage_block_data_signature: string;
  foliage_block_data: {
    extension_data: string;
    coinbase: string;
    unfinished_reward_block_hash: string;
  };
  prev_block_hash: string;
  reward_block_hash: string;
};

export default Foliage;