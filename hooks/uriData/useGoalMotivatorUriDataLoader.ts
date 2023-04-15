import GoalMotivatorUriDataEntity from "entities/uri/GoalMotivatorUriDataEntity";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import { useState, useEffect } from "react";

/**
 * Load goal motivator uri data from ipfs.
 */
export default function useGoalMotivatorUriDataLoader(uri?: string): {
  data: GoalMotivatorUriDataEntity | undefined;
} {
  const { loadJsonFromIpfs } = useIpfs();
  const { handleError } = useError();
  const [data, setData] = useState<GoalMotivatorUriDataEntity | undefined>();

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
