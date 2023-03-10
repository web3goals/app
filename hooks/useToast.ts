import { truncate } from "lodash";
import { useSnackbar } from "notistack";
import { errorToString } from "utils/converters";

/**
 * Hook for work with toasts.
 */
export default function useToasts() {
  const { enqueueSnackbar } = useSnackbar();

  let showToastSuccess = function (message: string) {
    enqueueSnackbar(message, {
      variant: "success",
    });
  };

  let showToastError = function (error: any) {
    const message = truncate(`Error: ${errorToString(error)}`, {
      length: 256,
    });
    enqueueSnackbar(message, {
      variant: "error",
    });
  };

  return {
    showToastSuccess,
    showToastError,
  };
}
