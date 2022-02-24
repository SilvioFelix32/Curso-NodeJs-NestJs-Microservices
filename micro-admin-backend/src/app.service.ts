import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { Category } from './Categories/interfaces/category.interface';
import { Player } from './players/interfaces/player.interface';
@Injectable()
export class AppService {

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('Players') private readonly playerModel: Model<Player>
  ) { }

  private readonly logger = new Logger(AppService.name)

  async createCategory(category: Category): Promise<Category> {
    try {
      const categoryCreated = new this.categoryModel(category)
      return await categoryCreated.save()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)} `)
      throw new RpcException(error.message)
    }
  }

  async getAllCategoies(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec()
    } catch (error) {
      this.logger.error(`error; ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async getCategoryById(category: string): Promise<Category> {
    try {
      return await this.categoryModel.findOne({ category }).exec()
    } catch (error) {
      throw new RpcException(error.message)
    }
  }
}
