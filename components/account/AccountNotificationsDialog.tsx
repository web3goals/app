import { Dialog, DialogContent, SxProps, Typography } from "@mui/material";
import { XlLoadingButton } from "components/styled";
import { epnsCommContractAbi } from "contracts/abi/epnsCommAddress";
import { ethers } from "ethers";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import {
  getChainId,
  getEpnsChannelAddress,
  getEpnsCommContractAddress,
} from "utils/chains";
import { stringToAddress } from "utils/converters";
import {
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

/**
 * Dialog to control notifications.
 */
export default function AccountNotificationsDialog(props: {
  address: string;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // State of contract reading to get subscription status
  const { data: isUserSubscribed, isFetched: isUserSubscribedFetched } =
    useContractRead({
      address: getEpnsCommContractAddress(chain),
      abi: epnsCommContractAbi,
      functionName: "isUserSubscribed",
      args: [
        getEpnsChannelAddress(chain) || ethers.constants.AddressZero,
        stringToAddress(props.address) || ethers.constants.AddressZero,
      ],
    });

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          my: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} textAlign="center">
          🔔 Notifications
        </Typography>
        {/* Enable button */}
        {isUserSubscribedFetched && !isUserSubscribed && (
          <>
            <>
              <Typography
                fontWeight={700}
                textAlign="center"
                sx={{ px: { xs: 0, md: 12 }, mt: 3 }}
              >
                enable notifications about new watchers of your goals
              </Typography>
              <EnableButton onUpdate={() => close()} sx={{ mt: 2 }} />
            </>
          </>
        )}
        {/* Disable button */}
        {isUserSubscribedFetched && isUserSubscribed && (
          <>
            <Typography
              fontWeight={700}
              textAlign="center"
              sx={{ px: { xs: 0, md: 12 }, mt: 3 }}
            >
              you enabled notifications about new watchers of your goals
            </Typography>
            <DisableButton onUpdate={() => close()} sx={{ mt: 2 }} />
          </>
        )}
        {/* Browser extension */}
        <Typography
          fontWeight={700}
          textAlign="center"
          sx={{ px: { xs: 0, md: 12 }, mt: 6 }}
        >
          to receive notifications your should install an browser extension
        </Typography>
        <XlLoadingButton
          href="https://chrome.google.com/webstore/detail/push-staging-protocol-alp/bjiennpmhdcandkpigcploafccldlakj"
          target="_blank"
          variant={
            isUserSubscribedFetched && isUserSubscribed
              ? "contained"
              : "outlined"
          }
          sx={{ mt: 2 }}
        >
          Install
        </XlLoadingButton>
      </DialogContent>
    </Dialog>
  );
}

function EnableButton(props: { onUpdate?: Function; sx?: SxProps }) {
  const { chain } = useNetwork();
  const { showToastSuccess } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getEpnsCommContractAddress(chain),
      abi: epnsCommContractAbi,
      functionName: "subscribe",
      args: [getEpnsChannelAddress(chain) || ethers.constants.AddressZero],
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
      showToastSuccess("Notifications are enabled!");
      props.onUpdate?.();
    }
  }, [isTransactionSuccess]);

  return (
    <XlLoadingButton
      variant="contained"
      disabled={
        isContractPrepareError || !contractWrite || isTransactionSuccess
      }
      loading={isContractWriteLoading || isTransactionLoading}
      onClick={() => contractWrite?.()}
      sx={{ ...props.sx }}
    >
      Enable
    </XlLoadingButton>
  );
}

function DisableButton(props: { onUpdate?: Function; sx?: SxProps }) {
  const { chain } = useNetwork();
  const { showToastSuccess } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getEpnsCommContractAddress(chain),
      abi: epnsCommContractAbi,
      functionName: "unsubscribe",
      args: [getEpnsChannelAddress(chain) || ethers.constants.AddressZero],
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
      showToastSuccess("Notifications are disabled!");
      props.onUpdate?.();
    }
  }, [isTransactionSuccess]);

  return (
    <XlLoadingButton
      variant="outlined"
      disabled={
        isContractPrepareError || !contractWrite || isTransactionSuccess
      }
      loading={isContractWriteLoading || isTransactionLoading}
      onClick={() => contractWrite?.()}
      sx={{ ...props.sx }}
    >
      Disable
    </XlLoadingButton>
  );
}
