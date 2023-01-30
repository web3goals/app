import { BigNumber, ethers } from "ethers";

/**
 * Convert "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1" to "0x430...c4b1".
 */
export function addressToShortAddress(address: string): string {
  let shortAddress = address;
  if (address?.length > 10) {
    shortAddress = `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  }
  return shortAddress?.toLowerCase();
}

/**
 * Convert error object to pretty string.
 */
export function errorToString(error: any): string {
  let errorString = JSON.stringify(error);
  if (error?.message) {
    errorString = error.message;
  }
  if (error?.error?.data?.message) {
    errorString = error.error.data.message.replace("execution reverted: ", "");
  }
  return errorString;
}

/**
 * Convert number like "0.01" to big number "10000000000000000".
 */
export function numberToBigNumberEthers(number?: number): BigNumber {
  if (!number) {
    return ethers.constants.Zero;
  }
  return ethers.utils.parseEther(number.toString());
}

/**
 * Convert date like "2023-03-01" to big number "1677628800".
 */
export function dateToBigNumberTimestamp(date?: string): BigNumber {
  if (!date) {
    return ethers.constants.Zero;
  }
  return BigNumber.from(new Date(date).getTime() / 1000);
}

/**
 * Convert date like "1677628800" to string "3/1/2023".
 */
export function bigNumberTimestampToLocaleDateString(
  bigNumberTimestamp?: BigNumber
): string {
  if (!bigNumberTimestamp) {
    return "Unknown";
  }
  return new Date(bigNumberTimestamp.toNumber() * 1000).toLocaleDateString();
}
