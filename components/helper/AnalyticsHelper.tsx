import { useEffect } from "react";
import { Analytics } from "utils/analytics";
import { useAccount } from "wagmi";

/**
 * Component to help use analytics.
 */
export default function AnalyticsHelper() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (address) {
      Analytics.identifyAccountAddress(address);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected) {
      Analytics.connectedAccount(address);
    }
  }, [isConnected]);

  return <></>;
}
