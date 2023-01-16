import {
  ConnectButton,
  useAccountBalance,
  useWallet,
  useSuiProvider,
} from '@suiet/wallet-kit';

export function SuiConnect() {
  const { account, connected, allAvailableWallets } = useWallet();
  console.log(allAvailableWallets)
  return (
      <ConnectButton>Connect Wallet</ConnectButton>
  );
}
