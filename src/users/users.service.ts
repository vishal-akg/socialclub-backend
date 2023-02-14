import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { instanceToPlain } from 'class-transformer';
import { InjectAwsService } from 'nest-aws-sdk';
import { Subject } from 'rxjs';
import ShortUniqueId from 'short-unique-id';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUser } from './dtos/find-user.dto';
import { GetSignedUrlDto } from './dtos/get-signed-url.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatedUserDto } from './dtos/updated-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly updated$$ = new Subject<UpdatedUserDto>();
  readonly updated$ = this.updated$$.asObservable();

  constructor(
    @InjectRepository(User) private readonly respository: Repository<User>,
    @InjectRepository(Post) private readonly postRepostiory: Repository<Post>,
    @InjectAwsService(S3) private readonly s3: S3,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {}

  async findOne(params: FindUser) {
    return this.respository.findOne({ where: { ...params } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.respository.findOneByOrFail({ id });
    const params = {
      ...user,
      ...updateUserDto,
    };

    const updatedUser = await this.respository.save(params);
    this.updated$$.next({
      user: updatedUser,
      modifiedFields: Object.keys(updateUserDto),
    });
    return updatedUser;
  }

  getUserPosts(userId: number) {
    return this.postRepostiory.find({
      where: { author: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  getSignedUrl(user: User, getSignedUrlDto: GetSignedUrlDto) {
    const uid = new ShortUniqueId({ length: 12 });
    const { filetype } = getSignedUrlDto;
    const id = uid();
    const metadata = {
      id,
      uploader: user.id,
      ...getSignedUrlDto,
    };

    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.configService.get('AWS_PROFILE_PICTURE_UPLOAD_BUCKET'),
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
