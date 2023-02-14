import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';
import { Subject } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {
  MediaTranscoded,
  ThumbnailOutputGroupDetail,
  VideoOutputGroupDetail,
} from '../interfaces/media-transcoded-successful.interface';
import { CreateMediaDto } from '../dtos/create-media.dto';
import { JobStatus } from '../enums/job-event.enum';
import { MediaService } from '../media.service';
import { UpdateMediaDto } from '../dtos/update-media.dto';
import { MediaInput } from '../interfaces/media-input.interface';
import { MediaProgressing } from '../interfaces/media-progressing.interface';
import { MediaJobStatus } from '../interfaces/media-status.interface';
import { MediaError } from '../interfaces/media-error.interface';
const AmazonS3URI = require('amazon-s3-uri');

@SqsProcess('SocialClubMediaConvertJobCompletion')
export class MediaJobCompletionHandler {
  private readonly submitted$$ = new Subject<any>();
  readonly submitted$ = this.submitted$$.asObservable();
  private readonly status$$ = new Subject<any>();
  readonly status$ = this.status$$.asObservable();
  private readonly completed$$ = new Subject<any>();
  readonly completed$ = this.completed$$.asObservable();
  private readonly error$$ = new Subject<MediaError>();
  readonly error$ = this.error$$.asObservable();

  constructor(private mediaService: MediaService) {}

  @SqsMessageHandler(false)
  async handleJobMessage(message: AWS.SQS.Message) {
    console.log(message);
    const parsedBody = JSON.parse(message.Body);
    const parsedMessage =
      typeof parsedBody.Message === 'string'
        ? JSON.parse(parsedBody.Message)
        : parsedBody.Message;

    switch (parsedMessage.status) {
      case JobStatus.PROGRESSING:
        {
          const media = plainToInstance(MediaProgressing, parsedMessage);
          const {
            jobId,
            status,
            userMetadata: { id, uploader },
          } = media;
          const createMediaDto: CreateMediaDto = {
            id,
            uploader,
            job: jobId,
            status,
          };
          const res = await this.mediaService.create(createMediaDto);
          console.log(res);
          if (res) this.submitted$$.next(media);
        }
        break;
      case JobStatus.STATUS_UPDATE:
        const media = plainToInstance(MediaJobStatus, parsedMessage);
        this.status$$.next(media);
        break;
      case JobStatus.INPUT_INFORMATION:
        {
          const media = plainToInstance(MediaInput, parsedMessage);
          const {
            jobId,
            inputDetails,
            status,
            userMetadata: { id, filename, uploader },
          } = media;
          const { bucket, key } = AmazonS3URI(inputDetails[0].uri);
          const updateMediaDto: UpdateMediaDto = {
            id,
            status,
            input: {
              bucket,
              key,
              filename,
              audioInputs: inputDetails.map(
                ({ audio: [{ channels, language, sampleRate }] }) => ({
                  channels,
                  language,
                  sampleRate,
                }),
              ),
              videoInputs: inputDetails.map(
                ({
                  video: [
                    {
                      bitDepth,
                      codec,
                      colorFormat,
                      frameRate,
                      width,
                      height,
                      interlaceMode,
                    },
                  ],
                }) => ({
                  bitDepth,
                  codec,
                  colorFormat,
                  frameRate,
                  width,
                  height,
                  interlaceMode,
                }),
              ),
            },
          };
          await this.mediaService.update(id, updateMediaDto);
        }
        break;
      case JobStatus.COMPLETE:
        {
          const media = plainToInstance(MediaTranscoded, parsedMessage);
          const {
            jobId,
            status,
            outputGroupDetails,
            userMetadata: { id, uploader },
          } = media;
          const outputGroups = [];
          const thumbnails = [];

          outputGroupDetails.forEach((outputGroupDetail) => {
            if (outputGroupDetail instanceof VideoOutputGroupDetail) {
              const videoOutputGroupDetail =
                outputGroupDetail as VideoOutputGroupDetail;
              const { type, outputDetails, playlistFilePaths } =
                videoOutputGroupDetail;
              const { bucket, key } = AmazonS3URI(playlistFilePaths[0]);
              outputGroups.push({
                type,
                bucket,
                key,
                outputGroupDetails: outputDetails
                  .filter(({ videoDetails }) => !!videoDetails)
                  .map(({ videoDetails: { widthInPx, heightInPx } }) => ({
                    width: widthInPx,
                    height: heightInPx,
                  })),
                duration: outputDetails[0].durationInMs,
              });
            } else if (
              outputGroupDetail instanceof ThumbnailOutputGroupDetail
            ) {
              const thumbnailOutputGroupDetail =
                outputGroupDetail as ThumbnailOutputGroupDetail;
              const { outputDetails, type } = thumbnailOutputGroupDetail;
              const {
                outputFilePaths,
                videoDetails: { widthInPx, heightInPx },
              } = outputDetails[0];

              const { bucket, key } = AmazonS3URI(outputFilePaths[0]);
              const [_, id, serial] = key.match(
                /^output\/([A-Za-z0-9]+)\/thumbnails\/[A-Za-z0-9]+_thumbnails\.([A-Za-z0-9]+)\.jpg$/i,
              );
              const serialLength = serial.length;
              const totalThumbnails = +serial + 1;

              for (let i = 0; i < totalThumbnails; i++) {
                const temp = '0'.repeat(serialLength) + i;
                const file = temp.substring(temp.length - serialLength);
                const uri = `output/${id}/thumbnails/${id}_thumbnails.${file}.jpg`;
                thumbnails.push({
                  index: i,
                  uri,
                  bucket,
                  width: widthInPx,
                  height: heightInPx,
                });
              }
            }
          });
          const updateMediaDto: UpdateMediaDto = {
            id,
            status,
            outputGroups,
            thumbnails,
          };
          const res = await this.mediaService.update(id, updateMediaDto);
          if (res) this.completed$$.next(media);
        }
        break;
      case JobStatus.ERROR: {
        const error = plainToInstance(MediaError, parsedMessage);
        this.error$$.next(error);
        console.log(error);
      }
    }
  }
}
