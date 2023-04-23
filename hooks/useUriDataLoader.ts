import GoalMessageUriDataEntity from "entities/uri/GoalMessageUriDataEntity";
import ProfileUriDataEntity from "entities/uri/ProfileUriDataEntity";
import ProofUriDataEntity from "entities/uri/ProofUriDataEntity";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useState, useEffect } from "react";

/**
 * Load uri data from ipfs.
 */
export default function useUriDataLoader<
  T extends ProfileUriDataEntity | ProofUriDataEntity | GoalMessageUriDataEntity
>(
  uri?: string
): {
  data: T | undefined;
} {
  const { loadJsonFromIpfs } = useIpfs();
  const { handleError } = useError();
  const [data, setData] = useState<T | undefined>();

  useEffect(() => {
    setData(undefined);
    if (uri) {
      loadJsonFromIpfs(uri)
        .then((data) => {
          setData(data);
        })
        .catch((error) => handleError(error, true));
    }
  }, [uri]);

  return { data };
}
