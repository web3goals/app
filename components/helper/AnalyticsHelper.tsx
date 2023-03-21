import { useEffect } from "react";
import {
  handleConnectedAccountEvent,
  handleDefineAccountAddressEvent,
} from "utils/analytics";
import { useAccount } from "wagmi";

/**
 * Component to help use analytics.
 */
export default function AnalyticsHelper() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (address) {
      handleDefineAccountAddressEvent(address);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected) {
      handleConnectedAccountEvent(address);
    }
  }, [isConnected]);

  return <></>;
}
