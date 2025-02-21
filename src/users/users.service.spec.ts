import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import mongoose, { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<User>

  const mockUserModel = {
    findById: jest.fn(),
  }
  const userMock = {
    _id: '678143ff7f6e36cf236766a8',
    fullName: 'giogi giorgadze',
    email: 'giorgi@gmail.com',
    posts: ['678143ff7f6e36cf236766a1', '678143ff7f6e36cf236766a2']
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: getModelToken('user'),
        useValue: mockUserModel
      }],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel= module.get<Model<User>>(getModelToken('user'))
  });

  describe('getById', () => {

    it('should return user when correct id is passed', async () => {
        jest.spyOn(mockUserModel, 'findById').mockResolvedValue(userMock)
        const user = await usersService.findOne(userMock._id)
        expect(user._id).toBe(userMock._id)
    })

    it('should throw error when wrong id is passed', async () => {
        const id = 'invalid id'
        expect(usersService.findOne(id)).rejects.toThrow(BadRequestException)
    })

    it('should throw not found exeption when user not found', async () => {
        jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true)
        jest.spyOn(mockUserModel, 'findById').mockResolvedValue(null)

        expect(usersService.findOne('rame id')).rejects.toThrow(NotFoundException)
    })
  })
 
});

  
