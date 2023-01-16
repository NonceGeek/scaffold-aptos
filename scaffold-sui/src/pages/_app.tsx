import "../styles/globals.css";
import "../styles/loading.css";
import '@suiet/wallet-kit/style.css';
// import "../styles/suiet-wallet-kit-custom.css";
import { NavBar } from "../components/NavBar";
import type { AppProps } from "next/app";
import {
  WalletProvider,
  AllDefaultWallets
} from '@suiet/wallet-kit';

function WalletSelector({ Component, pageProps }: AppProps) {

  return (
    <WalletProvider defaultWallets={AllDefaultWallets}>
      <div className="px-8 rootimage min-h-screen">
        <NavBar />
        <Component {...pageProps} className="bg-base-300" />
      </div>
    </WalletProvider>
  );
}

export default WalletSelector;
