import GoalUriDataEntity from "entities/GoalUriDataEntity";
import GoalWatcherUriDataEntity from "entities/GoalWatcherUriDataEntity";
import useError from "./useError";
import useIpfs from "./useIpfs";

/**
 * Hook for work with goals.
 */
export default function useGoal() {
  const { handleError } = useError();
  const { loadJsonFromIpfs } = useIpfs();

  let loadGoalUriData = async function (
    uri: string
  ): Promise<GoalUriDataEntity | undefined> {
    try {
      const data = await loadJsonFromIpfs(uri);
      return { description: data.description, deadline: data.deadline };
    } catch (error: any) {
      handleError(error, false);
      return undefined;
    }
  };

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
    loadGoalUriData,
    loadGoalWatcherUriData,
  };
}
