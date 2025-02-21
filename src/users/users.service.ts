import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/posts/schema/post.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private usersModel: Model<User>,
    // @InjectModel('post') private postModel: Model<Post>,
  ){}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.usersModel.findOne({email: createUserDto.email})
    if(existUser) throw new BadRequestException('User Alraedy exists')
    const user = await this.usersModel.create(createUserDto)
    return user
  }

  findAll() {
    return this.usersModel.find().populate({path: 'posts', select: '-user'})
  }

  async findOne(id: string) {
    if(!isValidObjectId(id)) throw new BadRequestException('Invaid Id')
    const user = await this.usersModel.findById(id)
    if(!user) throw new NotFoundException('user not found')
    return user
  }

  async update(role:string, tokenId:string, id: string, updateUserDto: UpdateUserDto) {
    if((tokenId !== id) && role !== 'admin') throw new UnauthorizedException('permition dineid')
    if(!isValidObjectId(id)) throw new BadRequestException('Invaid Id')
    const updatedUser = await this.usersModel.findByIdAndUpdate(id, updateUserDto, {new: true})
    if(!updatedUser) throw new BadRequestException('not found')
    return updatedUser
  }

  async remove(id: string) {
    if(!isValidObjectId(id)) throw new BadRequestException('Invaid Id')
    const deletedUser = await this.usersModel.findByIdAndDelete(id)
    if(!deletedUser) throw new BadRequestException('user not found')
    
    // await this.postModel.deleteMany({user: deletedUser._id})

    return deletedUser
  }

  async addPost(userId, postId){
    const updateUser = await this.usersModel.findByIdAndUpdate(userId, {$push: {posts: postId}})
    return updateUser
  }
}
