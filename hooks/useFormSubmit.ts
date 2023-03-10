import axios from "axios";
import { CONTACTS } from "constants/contacts";
import qs from "qs";
import useErrors from "./useError";

/**
 * Hook for work with formsubmit.io.
 */
export default function useFormSubmit() {
  const { handleError } = useErrors();

  let submitForm = async function (
    formType: string,
    formData: any,
    formAccountAddress: string | undefined
  ) {
    try {
      const postUrl = `https://formsubmit.co/ajax/${CONTACTS.email}`;
      const postData = qs.stringify({
        type: formType,
        account: formAccountAddress || "undefined",
        ...formData,
      });
      await axios.post(postUrl, postData);
    } catch (error: any) {
      handleError(error, false);
    }
  };

  return {
    submitForm,
  };
}
