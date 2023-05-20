import AccountGoalTabs from "components/account/AccountGoalTabs";
import AccountProfile from "components/account/AccountProfile";
import Layout from "components/layout";
import { FullWidthSkeleton } from "components/styled";
import { ethers } from "ethers";
import { useRouter } from "next/router";

/**
 * Page with an account.
 */
export default function Account() {
  const router = useRouter();
  const { address } = router.query;

  return (
    <Layout>
      {address && ethers.utils.isAddress(address.toString()) ? (
        <>
          <AccountProfile address={address.toString()} />
          <AccountGoalTabs address={address.toString()} sx={{ mt: 6 }} />
        </>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}
