export default interface GoalMessageEntity {
  readonly id: string;
  readonly goal: {
    id: string;
    description: string;
    authorAddress: string;
    isClosed: boolean;
  };
  readonly addedTimestamp: string;
  readonly authorAddress: string;
  readonly type: string;
  readonly isMotivating: boolean;
  readonly isSuperMotivating: boolean;
  readonly extraDataUri: string;
}
