import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import ShortUniqueId from 'short-unique-id';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMediaDto } from './dtos/create-media.dto';
import { GetSignedUrlDto } from './dtos/get-signed-url.dto';
import { UpdateMediaDto } from './dtos/update-media.dto';
import { Media } from './entities/media.entity';
import { MediaStatus } from './enums/media-status.enum';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectAwsService(S3) private readonly s3: S3,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async find(id: string) {
    return this.mediaRepository.findOne({
      where: { id },
      relations: { thumbnails: true },
    });
  }

  async create(createMediaDto: CreateMediaDto) {
    const existingMedia = await this.mediaRepository.findOneBy({
      id: createMediaDto.id,
    });
    if (existingMedia) {
      return;
    }
    const { uploader, ...rest } = createMediaDto;
    const user = await this.usersService.findOne({
      id: createMediaDto.uploader,
    });
    const media = this.mediaRepository.create({
      ...rest,
      uploader: user,
    });
    return this.mediaRepository.save(media);
  }

  async update(id: string, updateMediaDto: UpdateMediaDto) {
    const media = await this.mediaRepository.findOneBy({ id });
    if (!media) {
      throw new Error('Media does not exist with this id');
    }
    const { status, uploader, ...rest } = media;

    if (media.outputGroups && media.input) {
      return null;
    }
    if (media.status !== MediaStatus.COMPLETE) {
      media.status = status;
    }

    const updatedMedia = {
      ...rest,
      ...updateMediaDto,
    };
    return this.mediaRepository.save(updatedMedia);
  }

  async getSignedUrl(user: User, getSignedUrlDto: GetSignedUrlDto) {
    const count = await this.mediaRepository.count({
      where: { uploader: { id: user.id } },
    });
    if (count >= this.configService.get('MAX_MEDIA_UPLOAD_PER_USER')) {
      throw new ForbiddenException(
        `Sample App, So we have a quota of maximum ${this.configService.get(
          'MAX_MEDIA_UPLOAD_PER_USER',
        )} media uploads.`,
      );
    }

    const uid = new ShortUniqueId({ length: 12 });
    const { filename, filetype } = getSignedUrlDto;
    const id = uid();
    const metadata = {
      id,
      filename,
      uploader: user.id,
    };

    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.configService.get('AWS_MEDIA_UPLOAD_BUCKET'),
      Key: `input/${id}`,
      Expires: 9000,
      ContentType: filetype,
      Metadata: metadata,
    });

    return {
      url,
      metadata,
    };
  }
}
