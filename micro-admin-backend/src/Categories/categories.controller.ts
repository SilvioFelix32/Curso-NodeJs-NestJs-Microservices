import { Body, Controller, UsePipes, ValidationPipe, Post, Get, Put, Delete, Param, BadRequestException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto'
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return await this.categoriesService.createCategory(createCategoryDto)
    }

    @Get()
    async getAllCategories(): Promise<Array<Category>> {
        return await this.categoriesService.getAllCategories()
    }

    @Get('/:category')
    async getCategoryById(
        @Param('category') category: string): Promise<Category> {
        return await this.categoriesService.getCategoryById(category)
    }

    @Put('/:category')
    async updateCategory(
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Param('category') category: string): Promise<void> {
        return await this.categoriesService.updateCategory(category, updateCategoryDto)
    }

    @Post('/:category/players/:playerId')
    async assignPlayerToCategory(
        @Param() params: string[]): Promise<void> {
        return await this.categoriesService.assignPlayerToCategory(params)
    }

    @Delete()
    async deleteCategory() {

    }
}
