export default interface GoalEntity {
  readonly id: string;
  readonly createdTimestamp: string;
  readonly description: string;
  readonly authorAddress: string;
  readonly authorStake: string;
  readonly deadlineTimestamp: string;
  readonly isClosed: boolean;
  readonly isAchieved: boolean;
  readonly watchersNumber: number;
}
