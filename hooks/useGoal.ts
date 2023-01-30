import useIpfs from "./useIpfs";
import useError from "./useError";
import GoalUriDataEntity from "entities/GoalUriDataEntity";

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

  return {
    loadGoalUriData,
  };
}
