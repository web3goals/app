export default interface AccountEntity {
  readonly id: string;
  readonly achievedGoals: number;
  readonly failedGoals: number;
  readonly motivatedGoals: number;
  readonly notMotivatedGoals: number;
}
