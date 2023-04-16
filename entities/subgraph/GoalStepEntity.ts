export default interface GoalStepEntity {
  readonly id: string;
  readonly goal: {
    id: string;
    description: string;
    authorAddress: string;
    isClosed: boolean;
  };
  readonly createdTimestamp: string;
  readonly authorAddress: string;
  readonly type: string;
  readonly extraData: string;
  readonly extraDataUri: string;
}
