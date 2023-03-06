import GoalWatcherUriDataEntity from "entities/GoalWatcherUriDataEntity";
import useError from "./useError";
import useIpfs from "./useIpfs";

/**
 * Hook for work with goals.
 */
export default function useGoal() {
  const { handleError } = useError();
  const { loadJsonFromIpfs } = useIpfs();

  let loadGoalWatcherUriData = async function (
    uri: string
  ): Promise<GoalWatcherUriDataEntity | undefined> {
    try {
      const data = await loadJsonFromIpfs(uri);
      return { message: data.message };
    } catch (error: any) {
      handleError(error, false);
      return undefined;
    }
  };

  return {
    loadGoalWatcherUriData,
  };
}
