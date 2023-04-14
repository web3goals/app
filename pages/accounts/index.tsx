import { Typography } from "@mui/material";
import AccountList from "components/account/AccountList";
import Layout from "components/layout";

/**
 * Page with accounts.
 */
export default function Accounts() {
  return (
    <Layout>
      <Typography variant="h4" fontWeight={700} textAlign="center">
        ⚡ People
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        who fill this space with energy
      </Typography>
      <AccountList sx={{ mt: 4 }} />
    </Layout>
  );
}
