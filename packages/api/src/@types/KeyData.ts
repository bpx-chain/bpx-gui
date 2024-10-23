type KeyData = {
  fingerprint: number;
  label: string | null;
  publicKey: string;
  farmerPk: string;
  poolPk: string;
  secrets: {
    mnemonic: string[];
    entropy: string;
    privateKey: string;
  } | null;
};

export default KeyData;
