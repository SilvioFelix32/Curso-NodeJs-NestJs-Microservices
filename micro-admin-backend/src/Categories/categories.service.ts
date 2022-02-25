import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './interfaces/category.interface';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>) { }

    private readonly logger = new Logger(CategoriesService.name)

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
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
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

    async updateCategory(_id: string, category: Category): Promise<void> {

        try {
            await this.categoryModel.findOneAndUpdate({ _id }, { $set: category }).exec()
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }
}
