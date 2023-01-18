import {
  ConnectButton,
  useAccountBalance,
  useWallet,
  useSuiProvider,
} from '@suiet/wallet-kit';

export function SuiConnect() {
  const { account, connected, allAvailableWallets } = useWallet();
  return (
      <ConnectButton>Connect Wallet</ConnectButton>
  );
}
