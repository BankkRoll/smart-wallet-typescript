import type { AppProps } from 'next/app';
import {
  ThirdwebProvider,
  localWallet,
  metamaskWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";

// This is the chain your dApp will work on.
const activeChain = "goerli";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedWallets={[
        smartWallet({
          factoryAddress: process.env.TW_FACTORY_ADDRESS,
          thirdwebApiKey: process.env.TW_API_KEY,
          gasless: true,
          personalWallets: [metamaskWallet(), localWallet({ persist: true })],
        }),
      ]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
