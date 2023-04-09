import { ethers } from "ethers";
import { errorsLibraryAbi } from "contracts/abi/errorsLibrary";

/**
 * Convert error object to pretty object with error message and severity.
 */
export function errorToPrettyError(error: any): {
  message: string;
  severity: "info" | "error" | undefined;
} {
  let message = JSON.stringify(error);
  let severity: "info" | "error" | undefined = undefined;
  if (error?.message) {
    message = error.message;
  }
  if (error?.data?.message) {
    message = error.data.message.replace("execution reverted: ", "");
  }
  if (error?.error?.data?.message) {
    message = error.error.data.message.replace("execution reverted: ", "");
  }
  if (error?.error?.data?.data) {
    message = new ethers.utils.Interface(errorsLibraryAbi).parseError(
      error.error.data.data
    ).signature;
  }
  if (message.includes("insufficient funds for gas * price + value")) {
    message = "Insufficient funds to execute the transaction";
  }
  if (message === "AlreadyAccepted()") {
    message = "The motivator is already accepted";
    severity = "info";
  }
  if (message === "AlreadyMotivator()") {
    message = "You are already a motivator";
    severity = "info";
  }
  if (message === "AnyProofURINotExists()") {
    message = "You need to attach proofs before closing the goal";
  }
  if (message === "DeadlineMustBeAtLeast24HoursLater()") {
    message = "The deadline must not be less than 24 hours";
  }
  if (message === "NotAuthor()") {
    message = "You are not the goal's author";
  }
  if (message === "NotAuthorNotAcceptedMotivator()") {
    message = "You are not the goal's author or an accepted motivator";
  }
  if (message === "ProfileNotExists()") {
    message = "You need to create a profile on your account page to continue";
    severity = "info";
  }
  if (message === "StakeInvalid()") {
    message = "Stake is invalid";
  }
  return {
    message: message,
    severity: severity,
  };
}
