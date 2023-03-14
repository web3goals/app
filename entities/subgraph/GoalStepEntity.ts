export default interface GoalStepEntity {
  readonly id: string;
  readonly createdTimestamp: string;
  readonly authorAddress: string;
  readonly type: string;
  readonly extraDataUri: string;
}
