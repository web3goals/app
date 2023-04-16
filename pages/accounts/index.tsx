import AccountExplore from "components/account/AccountExplore";
import Layout from "components/layout";

/**
 * Page with accounts.
 */
export default function Accounts() {
  return (
    <Layout>
      <AccountExplore displayLoadMoreButton />
    </Layout>
  );
}
