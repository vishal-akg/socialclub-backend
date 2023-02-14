import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uniqueId } from 'src/common/helpers/unique-id.generator';
import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AddReactionDto } from './dtos/add-reaction.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { Post } from './entities/post.entity';
import { Reaction } from './entities/reaction.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly repsoitory: Repository<Post>,
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async find() {
    return this.repsoitory.find();
  }

  async create(user: User, createPostDto: CreatePostDto) {
    const { mediaId, thumbnailIndex, ...rest } = createPostDto;
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
      relations: { outputGroups: true, thumbnails: true, uploader: true },
    });

    if (media.uploader.id !== user.id) {
      throw new ForbiddenException(
        "You cannot perform this action on someone else's behalf.",
      );
    }

    const { uploader, thumbnails } = media;
    const {
      duration,
      key,
      outputGroupDetails: [{ width, height }],
    } = media.outputGroups[0];

    const selectedThumbnail = thumbnails.find(
      (thumbnail) => thumbnail.index === thumbnailIndex,
    );

    const post = this.repsoitory.create({
      ...rest,
      media,
      width,
      height,
      duration,
      uri: key,
      thumbnailIndex,
      id: uniqueId(),
      author: uploader,
      thumbnail: selectedThumbnail.uri,
    });

    return this.repsoitory.save(post);
  }

  async getReaction(user: User, postId: string) {
    return this.reactionRepository.findOneBy({
      post: { id: postId },
      user: { id: user.id },
    });
  }

  async addReaction(user: User, postId: string, addReactDto: AddReactionDto) {
    const post = await this.repsoitory.findOneOrFail({
      where: { id: postId },
    });
    let reaction = await this.reactionRepository.findOne({
      where: { user: { id: user.id }, post: { id: post.id } },
    });
    if (reaction) {
      reaction.type = addReactDto.type;
    } else {
      reaction = this.reactionRepository.create({
        user,
        post,
        type: addReactDto.type,
      });
    }

    return this.reactionRepository.save(reaction);
  }

  async deleteReaction(user: User, reactionId: number) {
    const reaction = await this.reactionRepository.findOneOrFail({
      where: { id: reactionId },
      relations: { user: true },
    });

    if (reaction.user.id !== user.id) {
      throw new ForbiddenException(
        'You cannot react on behalf of someone else.',
      );
    }
    return this.reactionRepository.remove(reaction);
  }
}
