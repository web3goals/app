import { useEffect } from "react";
import { handleDefineAccountAddressEvent } from "utils/analytics";
import { useAccount } from "wagmi";

/**
 * Component to help use analytics.
 */
export default function AnalyticsHelper() {
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      handleDefineAccountAddressEvent(address);
    }
  }, [address]);

  return <></>;
}
