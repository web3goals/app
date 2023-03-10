export default interface ProofDocumentsUriDataEntity {
  readonly documents: Array<{
    description?: string;
    type?: "FILE" | "IMAGE" | "VIDEO" | "LIVEPEER_VIDEO";
    addedData?: number;
    uri?: string;
    livepeerPlaybackId?: string;
  }>;
}
