import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Post } from './schema/post.schema';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('post') private postModel: Model<Post>,
    @InjectModel('user') private userModel: Model<User>,
    // private userService: UsersService
  ){}

  async create(subscription: string, userId: string, createPostDto: CreatePostDto) {
    const user = await this.userModel.findById(userId)
    if(!user) throw new NotFoundException('user not found')
    const postsCount = user.posts.length
    if(subscription === 'free' && postsCount >= 10) throw new BadRequestException('upgrade subscription plan')
    if(subscription === 'premium' && postsCount >= 15) throw new BadRequestException('upgrade subscription plan')
    if(subscription === 'pro' && postsCount >= 20) throw new BadRequestException('upgrade subscription plan')
    const newPost = await this.postModel.create({...createPostDto, user: user._id})
    await this.userModel.findByIdAndUpdate(user._id, {$push: {posts: newPost._id }})
    return newPost
  }

  findAll() {
    return this.postModel.find().populate({path: "user", select: '-posts -createdAt -__v'})
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(userId, id: string) {
    if(!isValidObjectId(id)) throw new BadRequestException('invalid id is provided')
    const deletedPost = await this.postModel.findByIdAndDelete(id)
    if(!deletedPost) throw new NotFoundException('not found')
    await this.userModel.findByIdAndUpdate(userId, {$pull: {posts: deletedPost._id}})
    return deletedPost
  }
}
