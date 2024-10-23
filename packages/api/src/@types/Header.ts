type Header = {
  data: {
    execution_block_hash: string;
    finish_time: number;
    finished: boolean;
    header_hash: string;
    height: number;
    prev_header_hash: string;
    proof_of_space_hash: string;
    timestamp: string;
    total_iters: string;
    weight: string;
  };
  plot_signature: string;
};

export default Header;
