import "../styles/globals.css";
import "../styles/loading.css";
import "../styles/select-input.css";
import '../styles/markdown.css';

// Point: change this file if there is any need to adjust the markdown style.
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";
import type { AppProps } from "next/app";
import { useMemo, useState } from "react";
import {
  FewchaWalletAdapter,
  PontemWalletAdapter,
  MartianWalletAdapter,
  WalletProvider,
  AptosWalletAdapter,
} from "@manahippo/aptos-wallet-adapter";
import { ModalContext, ModalState } from "../components/ModalContext";
function WalletSelector({ Component, pageProps }: AppProps) {

  
  const [modalState, setModalState] = useState<ModalState>({
    walletModal: false,
  });
  const wallets = useMemo(
    () => [
      new AptosWalletAdapter(),
      new MartianWalletAdapter(),
      new PontemWalletAdapter(),
      new FewchaWalletAdapter(),
    ],
    []
  );
  const modals = useMemo(
    () => ({
      modalState,
      setModalState: (modalState: ModalState) => {
        setModalState(modalState);
      },
    }),
    [modalState]
  );

  return (
    <div>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <ModalContext.Provider value={modals}>
          <div className="px-8">
            <NavBar />
            <Component {...pageProps} className="bg-base-300" />
          </div>
        </ModalContext.Provider>
      </WalletProvider>
    <Footer />
    </div>
    
  );
}

export default WalletSelector;
