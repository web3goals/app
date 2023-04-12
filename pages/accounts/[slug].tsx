import AccountGoalTabs from "components/account/AccountGoalTabs";
import AccountProfile from "components/account/AccountProfile";
import Layout from "components/layout";
import { useRouter } from "next/router";

/**
 * Page with an account.
 */
export default function Account() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <Layout>
      {slug && (
        <>
          <AccountProfile address={slug as string} />
          <AccountGoalTabs address={slug as string} sx={{ mt: 6 }} />
        </>
      )}
    </Layout>
  );
}
