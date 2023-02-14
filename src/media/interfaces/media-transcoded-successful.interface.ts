import { Type } from 'class-transformer';
import { MediaStatus } from '../enums/media-status.enum';

export class UserMetadata {
  id: string;
  uploader: number;
  filename: string;
}

export class VideoDetails {
  widthInPx: number;
  heightInPx: number;
}

export class OutputGroupDetail {
  type: string;
}

export class VideoOutputDetails {
  durationInMs: number;
  videoDetails: VideoDetails;
}

export class ThumbnailOutputDetails {
  outputFilePaths: string[];
  durationInMs: number;
  videoDetails: VideoDetails;
}

export class VideoOutputGroupDetail extends OutputGroupDetail {
  type: string = 'DASH_ISO_GROUP';
  playlistFilePaths: string[];
  outputDetails: VideoOutputDetails[];
}

export class ThumbnailOutputGroupDetail extends OutputGroupDetail {
  type: string = 'FILE_GROUP';
  outputDetails: ThumbnailOutputDetails[];
}

export class MediaTranscoded {
  timestamp: number;
  accountId: string;
  queue: string;
  jobId: string;
  status: MediaStatus;
  userMetadata: UserMetadata;
  @Type(() => OutputGroupDetail, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: VideoOutputGroupDetail, name: 'DASH_ISO_GROUP' },
        { value: ThumbnailOutputGroupDetail, name: 'FILE_GROUP' },
      ],
    },
  })
  outputGroupDetails: OutputGroupDetail[];
}
