import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const newUser = new this.userModel(dto);
    const response = await newUser.save();
    return new UserEntity(response.toObject() as Partial<UserEntity>);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userModel.find();
    const plainUsers = users.map((user) => user.toObject());
    return plainToInstance(UserEntity, plainUsers);
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(`User not found`);
    return new UserEntity(user.toObject() as Partial<UserEntity>);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User not found`);
    }
  }
}
