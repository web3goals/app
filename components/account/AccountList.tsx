import { Box, Stack, SxProps, Typography } from "@mui/material";
import {
  CardBox,
  ExtraLargeLoadingButton,
  FullWidthSkeleton,
} from "components/styled";
import AccountEntity from "entities/subgraph/AccountEntity";
import useAccountsFinder from "hooks/subgraph/useAccountsFinder";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import AccountCard from "./AccountCard";

/**
 * A component with account list.
 */
export default function AccountList(props: {
  pageSize?: number;
  hideLoadMoreButton?: boolean;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = props.pageSize || 10;
  const { data: pageAccounts } = useAccountsFinder({
    chain: chain,
    first: pageSize,
    skip: pageNumber * pageSize,
  });
  const [allAccounts, setAllAccounts] = useState<AccountEntity[] | undefined>();

  useEffect(() => {
    if (pageAccounts) {
      setAllAccounts(
        pageNumber === 0
          ? pageAccounts
          : [...(allAccounts || []), ...pageAccounts]
      );
    }
  }, [pageAccounts]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ ...props.sx }}
    >
      {/* Not empty list */}
      {allAccounts && allAccounts.length > 0 && (
        <>
          <Stack width={1} spacing={2}>
            {allAccounts.map((account, index) => (
              <AccountCard key={index} account={account} />
            ))}
          </Stack>
          {!props.hideLoadMoreButton && pageAccounts?.length === pageSize && (
            <ExtraLargeLoadingButton
              variant="outlined"
              loading={!pageAccounts}
              onClick={() => setPageNumber(pageNumber + 1)}
              sx={{ mt: 4 }}
            >
              Load More
            </ExtraLargeLoadingButton>
          )}
        </>
      )}
      {/* Empty list */}
      {allAccounts && allAccounts.length === 0 && (
        <CardBox>
          <Typography textAlign="center">😐 no people</Typography>
        </CardBox>
      )}
      {/* Loading list */}
      {!allAccounts && <FullWidthSkeleton />}
    </Box>
  );
}
