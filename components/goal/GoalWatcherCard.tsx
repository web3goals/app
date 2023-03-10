import { Link as MuiLink, SxProps, Typography } from "@mui/material";
import { CardBox, XlLoadingButton } from "components/styled";
import { goalContractAbi } from "contracts/abi/goalContract";
import GoalWatcherUriDataEntity from "entities/GoalWatcherUriDataEntity";
import { BigNumber, ethers } from "ethers";
import useError from "hooks/useError";
import useGoal from "hooks/useGoal";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import { getChainId, getGoalContractAddress } from "utils/chains";
import {
  addressToShortAddress,
  bigNumberTimestampToLocaleDateString,
  stringToAddress,
} from "utils/converters";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

/**
 * A component with a goal watcher card.
 */
export default function GoalWatcherCard(props: {
  id: string;
  authorAddress: string;
  accountAddress: string;
  addedTimestamp: BigNumber;
  extraDataURI: string;
  isAccepted: boolean;
  onUpdate?: Function;
  sx?: SxProps;
}) {
  const { address } = useAccount();
  const { handleError } = useError();
  const { loadGoalWatcherUriData } = useGoal();
  const [uriData, setUriData] = useState<
    GoalWatcherUriDataEntity | undefined
  >();

  useEffect(() => {
    setUriData(undefined);
    loadGoalWatcherUriData(props.extraDataURI)
      .then((data) => setUriData(data))
      .catch((error) => handleError(error, true));
  }, [props.extraDataURI]);

  return (
    <CardBox sx={{ ...props.sx }}>
      {/* Message */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {uriData?.message || "..."}
      </Typography>
      {/* Account */}
      <Typography gutterBottom>
        👤{" "}
        <MuiLink href={`/accounts/${props.accountAddress}`} fontWeight={700}>
          {addressToShortAddress(props.accountAddress)}
        </MuiLink>
      </Typography>
      {/* Date */}
      <Typography>
        📅 {bigNumberTimestampToLocaleDateString(props.addedTimestamp)}
      </Typography>
      {/* Accept button */}
      {!props.isAccepted && address === props.authorAddress && (
        <AcceptButton
          id={props.id}
          accountAddress={props.accountAddress}
          onSuccess={props.onUpdate}
          sx={{ mt: 2 }}
        />
      )}
    </CardBox>
  );
}

function AcceptButton(props: {
  id: string;
  accountAddress: string;
  onSuccess?: Function;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();
  const { showToastSuccess } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getGoalContractAddress(chain),
      abi: goalContractAbi,
      functionName: "acceptMotivator",
      args: [
        BigNumber.from(props.id),
        stringToAddress(props.accountAddress) || ethers.constants.AddressZero,
      ],
      chainId: getChainId(chain),
    });
  const {
    data: contractWriteData,
    isLoading: isContractWriteLoading,
    write: contractWrite,
  } = useContractWrite(contractPrepareConfig);
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      hash: contractWriteData?.hash,
    });

  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("Watcher is accepted!");
      props.onSuccess?.();
    }
  }, [isTransactionSuccess]);

  if (!isTransactionSuccess) {
    return (
      <XlLoadingButton
        variant="outlined"
        disabled={isContractPrepareError || !contractWrite}
        loading={isContractWriteLoading || isTransactionLoading}
        onClick={() => contractWrite?.()}
        sx={{ ...props.sx }}
      >
        Accept
      </XlLoadingButton>
    );
  }

  return <></>;
}
