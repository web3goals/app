export default interface AccountEntity {
  readonly id: string;
  readonly profileId: string;
  readonly profileCreatedTimestamp: number;
  readonly profileUri: string;
  readonly goals: number;
  readonly achievedGoals: number;
  readonly failedGoals: number;
  readonly motivations: number;
  readonly superMotivations: number;
}
