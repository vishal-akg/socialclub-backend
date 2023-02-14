import { MediaStatus } from '../enums/media-status.enum';

export class UserMetadata {
  id: string;
  uploader: number;
  filename: string;
}

export class MediaProgressing {
  timestamp: number;
  accountId: string;
  queue: string;
  jobId: string;
  status: MediaStatus;
  userMetadata: UserMetadata;
}
