import { MediaStatus } from '../enums/media-status.enum';

export class UserMetadata {
  id: string;
  uploader: number;
  filename: string;
}

export class Audio {
  channels: number;
  codec: string;
  language: string;
  sampleRate: number;
  streamId: number;
}

export class Video {
  bitDepth: number;
  codec: string;
  colorFormat: string;
  fourCC: string;
  frameRate: number;
  height: number;
  interlaceMode: string;
  sar: string;
  standard: string;
  streamId: number;
  width: number;
}

export class InputDetail {
  audio: Audio[];
  id: number;
  uri: string;
  video: Video[];
}

export class MediaInput {
  timestamp: number;
  accountId: string;
  queue: string;
  jobId: string;
  status: MediaStatus;
  userMetadata: UserMetadata;
  inputDetails: InputDetail[];
}
