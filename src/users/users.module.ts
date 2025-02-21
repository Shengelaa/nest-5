import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schema/user.schema';
import { postSchema } from 'src/posts/schema/post.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'user', schema: userSchema},
    {name: 'post', schema: postSchema},
  ])],
  controllers: [UsersController],
  providers: [UsersService],
  // exports: [UsersService]
})
export class UsersModule {}
