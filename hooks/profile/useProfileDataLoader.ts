import ProfileUriDataEntity from "entities/uri/ProfileUriDataEntity";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useState, useEffect } from "react";

/**
 * Load profile uri data from ipfs.
 */
export default function useProfileUriDataLoader(uri?: string): {
  data: ProfileUriDataEntity | undefined;
} {
  const { loadJsonFromIpfs } = useIpfs();
  const { handleError } = useError();
  const [data, setData] = useState<ProfileUriDataEntity | undefined>();

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
