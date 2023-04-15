export default interface AccountEntity {
  readonly id: string;
  readonly profileId: string;
  readonly profileCreatedTimestamp: number;
  readonly profileUri: string;
  readonly achievedGoals: number;
  readonly failedGoals: number;
  readonly motivatedGoals: number;
  readonly notMotivatedGoals: number;
}
