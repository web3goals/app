export default interface TextAttachmentUriDataEntity {
  readonly text?: string;
  readonly attachment?: {
    type?: "FILE" | "IMAGE" | "VIDEO" | "LIVEPEER_VIDEO";
    addedData?: number;
    uri?: string;
    livepeerPlaybackId?: string;
  };
}
