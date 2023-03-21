import {
  createReactClient,
  LivepeerConfig,
  studioProvider,
} from "@livepeer/react";
import { ThemeProvider } from "@mui/material";
import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import AnalyticsHelper from "components/helper/AnalyticsHelper";
import { DialogProvider } from "context/dialog";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";
import { theme } from "theme";
import { Analytics } from "utils/analytics";
import { getSupportedChains } from "utils/chains";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "../styles/globals.css";

const { chains, provider } = configureChains(
  [...getSupportedChains()],
  [
    // Alchemy provider
    ...(process.env.NEXT_PUBLIC_ALCHEMY_ID
      ? [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID })]
      : []),
    // Public provider
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Web3 Goals",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY || "",
  }),
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [pageLoaded, setPageLoaded] = useState(false);

  /**
   * Fix for hydration error (docs - https://github.com/vercel/next.js/discussions/35773#discussioncomment-3484225)
   */
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  /**
   * Init analytics.
   */
  useEffect(() => {
    Analytics.init();
  }, []);

  /**
   * Send page view event to analytics if page changed via router.
   */
  useEffect(() => {
    const handleRouteChange = function () {
      Analytics.pageView();
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({ accentColor: theme.palette.primary.main })}
      >
        <LivepeerConfig client={livepeerClient}>
          <CookiesProvider>
            <ThemeProvider theme={theme}>
              <SnackbarProvider maxSnack={3}>
                <DialogProvider>
                  <NextNProgress
                    height={4}
                    color={theme.palette.primary.main}
                  />
                  {pageLoaded && (
                    <>
                      <AnalyticsHelper />
                      <Component {...pageProps} />
                    </>
                  )}
                </DialogProvider>
              </SnackbarProvider>
            </ThemeProvider>
          </CookiesProvider>
        </LivepeerConfig>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
