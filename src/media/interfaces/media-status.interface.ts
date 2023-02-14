import { MediaStatus } from '../enums/media-status.enum';

export class MediaJobStatus {
  timestamp: number;
  accountId: string;
  queue: string;
  jobId: string;
  status: MediaStatus;
  userMetadata: UserMetadata;
  framesDecoded: number;
  jobProgress: JobProgress;
}

export class UserMetadata {
  id: string;
  uploader: number;
  filename: string;
}

export class JobProgress {
  phaseProgress: PhaseProgress;
  jobPercentComplete: number;
  currentPhase: string;
  retryCount: number;
}

export class PhaseProgress {
  PROBING: Probing;
  TRANSCODING: Transcoding;
  UPLOADING: Uploading;
}

export class Probing {
  status: string;
  percentComplete: number;
}

export class Transcoding {
  status: string;
  percentComplete: number;
}

export class Uploading {
  status: string;
  percentComplete: number;
}
