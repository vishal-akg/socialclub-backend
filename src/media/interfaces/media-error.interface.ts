import { Exclude } from 'class-transformer';

export class UserMetaData {
  filename: string;
  id: string;
  uploader: number;
}

export class Message {
  errorType: string;
  errorMessage: string;
  @Exclude()
  trace: string[];
}

export class MediaError {
  status: string;
  errorCode: number;
  userMetadata: UserMetaData;
  errorMessage: Message | string;
}
