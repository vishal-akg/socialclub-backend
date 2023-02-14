import { SqsMessageHandler, SqsProcess } from '@nestjs-packages/sqs';
import { plainToInstance } from 'class-transformer';
import { ProfilePictureUpdate } from '../interfaces/profile-picture-update.interface';
import { UsersService } from '../users.service';

@SqsProcess('SocialClubProfilePictureJobComplete')
export class ProfilePictureJobCompletionHandler {
  constructor(private usersService: UsersService) {}

  @SqsMessageHandler(false)
  async handleJobMessage(message: AWS.SQS.Message) {
    const parsedBody = JSON.parse(message.Body);
    const profilePicture = plainToInstance(
      ProfilePictureUpdate,
      parsedBody.details,
    );

    if (profilePicture.type === 'avatar') {
      await this.usersService.update(profilePicture.uploader, {
        avatar: profilePicture.key,
      });
    } else if (profilePicture.type === 'cover') {
      await this.usersService.update(profilePicture.uploader, {
        cover: profilePicture.key,
      });
    }
    console.log(profilePicture);
  }
}
