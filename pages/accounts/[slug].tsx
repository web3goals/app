import { Typography } from "@mui/material";
import Layout from "components/layout";
import { CentralizedBox } from "components/styled";
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
        <CentralizedBox>
          <Typography textAlign="center">{slug}</Typography>
        </CentralizedBox>
      )}
    </Layout>
  );
}
