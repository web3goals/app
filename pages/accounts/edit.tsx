import AccountEditProfileForm from "components/account/AccountEditProfileForm";
import AccountEditProfileJoinMessage from "components/account/AccountEditProfileJoinMessage";
import Layout from "components/layout";
import { FullWidthSkeleton } from "components/styled";
import { PROFILE_CONTRACT_ROLES } from "constants/profile";
import { profileContractAbi } from "contracts/abi/profileContract";
import ProfileUriDataEntity from "entities/uri/ProfileUriDataEntity";
import { ethers } from "ethers";
import useUriDataLoader from "hooks/useUriDataLoader";
import { chainToSupportedChainProfileContractAddress } from "utils/chains";
import { stringToAddress } from "utils/converters";
import { useAccount, useContractRead, useNetwork } from "wagmi";

/**
 * Page to edit account.
 */
export default function EditAccount() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  /**
   * Define role
   */
  const { data: isHasRole, isFetching: isHasRoleFetching } = useContractRead({
    address: chainToSupportedChainProfileContractAddress(chain),
    abi: profileContractAbi,
    functionName: "hasRole",
    args: [
      PROFILE_CONTRACT_ROLES.moderator,
      stringToAddress(address) || ethers.constants.AddressZero,
    ],
  });

  /**
   * Define profile uri data
   */
  const { data: profileUri, isFetching: isProfileUriFetching } =
    useContractRead({
      address: chainToSupportedChainProfileContractAddress(chain),
      abi: profileContractAbi,
      functionName: "getURI",
      args: [stringToAddress(address) || ethers.constants.AddressZero],
    });
  const { data: profileUriData } =
    useUriDataLoader<ProfileUriDataEntity>(profileUri);

  if (isHasRoleFetching || isProfileUriFetching) {
    return (
      <Layout maxWidth="sm">
        <FullWidthSkeleton />
      </Layout>
    );
  } else if (!isHasRole) {
    return (
      <Layout maxWidth="sm">
        <AccountEditProfileJoinMessage />
      </Layout>
    );
  } else {
    return (
      <Layout maxWidth="xs">
        <AccountEditProfileForm profileData={profileUriData} />
      </Layout>
    );
  }
}
