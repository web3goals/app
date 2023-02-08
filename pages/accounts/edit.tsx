import AccountEditBioForm from "components/account/AccountEditBioForm";
import Layout from "components/layout";
import { CentralizedBox, FullWidthSkeleton } from "components/styled";
import { bioContractAbi } from "contracts/abi/bioContract";
import { ethers } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useEffect, useState } from "react";
import { getBioContractAddress } from "utils/chains";
import { useAccount, useContractRead, useNetwork } from "wagmi";
/**
 * Page to edit account.
 */
export default function EditAccount() {
  const { handleError } = useError();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { loadJsonFromIpfs } = useIpfs();
  const [bioData, setBioData] = useState<any>();

  // Contract states
  const {
    status: contractReadStatus,
    error: contractReadError,
    data: contractReadData,
  } = useContractRead({
    address: getBioContractAddress(chain),
    abi: bioContractAbi,
    functionName: "getURI",
    args: [ethers.utils.getAddress(address || ethers.constants.AddressZero)],
  });

  useEffect(() => {
    if (address && contractReadStatus === "success") {
      if (contractReadData) {
        loadJsonFromIpfs(contractReadData)
          .then((result) => setBioData(result))
          .catch((error) => handleError(error, true));
      } else {
        setBioData({});
      }
    }
    if (address && contractReadStatus === "error" && contractReadError) {
      setBioData({});
    }
  }, [address, contractReadStatus, contractReadError, contractReadData]);

  return (
    <Layout maxWidth="xs">
      <CentralizedBox>
        {bioData ? (
          <AccountEditBioForm bioData={bioData} />
        ) : (
          <FullWidthSkeleton />
        )}
      </CentralizedBox>
    </Layout>
  );
}
