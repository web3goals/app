import { Box, Stack, SxProps, Typography } from "@mui/material";
import {
  CardBox,
  ExtraLargeLoadingButton,
  FullWidthSkeleton,
} from "components/styled";
import AccountEntity from "entities/subgraph/AccountEntity";
import useError from "hooks/useError";
import useSubgraph from "hooks/useSubgraph";
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
  const { handleError } = useError();
  const { findAccounts } = useSubgraph();
  const [accounts, setAccounts] = useState<Array<AccountEntity> | undefined>();
  const [isMoreAccountsExist, setIsMoreAccountsExist] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = props.pageSize || 10;

  async function loadMoreAccounts(
    pageNumber: number,
    existingAccounts: Array<AccountEntity>
  ) {
    try {
      const loadedAccounts = await findAccounts({
        chain: chain,
        first: pageSize,
        skip: pageNumber * pageSize,
      });
      setAccounts([...existingAccounts, ...loadedAccounts]);
      setIsMoreAccountsExist(loadedAccounts.length === pageSize);
      setPageNumber(pageNumber);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadMoreAccounts(0, []);
  }, [chain, props]);

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* List with accounts */}
      {accounts && accounts.length > 0 && (
        <Stack spacing={2}>
          {accounts.map((account, index) => (
            <AccountCard key={index} account={account} />
          ))}
          {/* Actions */}
          {!props.hideLoadMoreButton && isMoreAccountsExist && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={4}
            >
              <ExtraLargeLoadingButton
                variant="outlined"
                onClick={() => {
                  loadMoreAccounts(pageNumber + 1, accounts);
                }}
              >
                Load More
              </ExtraLargeLoadingButton>
            </Box>
          )}
        </Stack>
      )}
      {/* Empty list */}
      {accounts && accounts.length === 0 && (
        <CardBox>
          <Typography textAlign="center">😐 no people</Typography>
        </CardBox>
      )}
      {/* Loading list */}
      {!accounts && <FullWidthSkeleton />}
    </Box>
  );
}
