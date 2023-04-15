import { SxProps } from "@mui/material";
import EntityList from "components/entity/EntityList";
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
    <EntityList
      entities={allAccounts}
      renderEntityCard={(account, index) => (
        <AccountCard key={index} account={account} />
      )}
      noEntitiesText="😐 no people"
      displayLoadMoreButton={
        !props.hideLoadMoreButton && pageAccounts?.length === pageSize
      }
      isMoreLoading={!pageAccounts}
      onLoadMoreButtonClick={() => setPageNumber(pageNumber + 1)}
      sx={{ ...props.sx }}
    />
  );
}
