import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './interfaces/category.interface';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { PlayersService } from 'src/Players/players.service';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
        private readonly playersService: PlayersService) { }

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const { category } = createCategoryDto
        const categoryFound = await this.categoryModel.findOne({ category }).exec()

        if (categoryFound) {
            throw new BadRequestException(`Categoria ${category} já cadastrada`)
        }

        const createdCategory = new this.categoryModel(createCategoryDto)
        return await createdCategory.save()
    }

    async getAllCategories(): Promise<Array<Category>> {
        return await this.categoryModel.find().populate('players').exec()
    }

    async getCategoryById(category: string): Promise<Category> {
        const categoryFound = await this.categoryModel.findOne({ category }).exec()

        if (!categoryFound) {
            throw new NotFoundException(`Categoria ${category} não encontrada`)
        }

        return categoryFound
    }

    async getPlayerCategory(playerId: any): Promise<Category> {
        const players = await this.playersService.getAllPlayers()

        const playersFilter = players.filter(player => player._id == playerId)

        if (playersFilter.length == 0) {
            throw new BadRequestException(`O id ${playerId} não é um jogador!`)
        }

        return await this.categoryModel.findOne().where('players').in(playerId).exec()
    }

    async updateCategory(category: string, updateCategoryDto: UpdateCategoryDto): Promise<void> {
        const categoryFound = await this.categoryModel.findOne({ category }).exec()

        if (!categoryFound) {
            throw new NotFoundException(`Categoria ${category} não encontrada`)
        }

        await this.categoryModel.findOneAndUpdate({ category },
            { $set: updateCategoryDto }).exec()
    }

    async assignPlayerToCategory(params: string[]): Promise<void> {
        const category = params['category']
        const playerId = params['playerId']

        const categoryFound = await this.categoryModel.findOne({ category }).exec()
        const playerAlreadyRegisteredInTheCategory = await this.categoryModel.find({ category }).where('players').in(playerId).exec()

        await this.playersService.getPlayerById(playerId)

        if (!categoryFound) {
            throw new BadRequestException(`Categoria ${category} não encontrada `)
        }

        if (playerAlreadyRegisteredInTheCategory.length > 0) {
            throw new BadRequestException(`Jogador ${playerId} já cadastrado na Categoria ${category}!`)
        }

        categoryFound.players.push(playerId)
        await this.categoryModel.findOneAndUpdate({ category }, { $set: categoryFound }).exec()
    }
}
