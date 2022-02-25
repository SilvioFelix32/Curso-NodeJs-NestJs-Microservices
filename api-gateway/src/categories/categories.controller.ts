import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';


@Controller('api/v1/categories')
export class CategoriesController {

    constructor(
        private clientProxySmartRanking: ClientProxySmartRanking
    ) { }

    private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()
    @Post()
    @UsePipes(ValidationPipe)
    createCategory(
        @Body() createCategoryDto: CreateCategoryDto) {

        this.clientAdminBackend.emit('create-category', createCategoryDto)

    }

    @Get()
    consultarCategorias(@Query('categoryId') _id: string): Observable<any> {

        return this.clientAdminBackend.send('get-categories', _id ? _id : '')

    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    atualizarCategoria(@Body() updateCategoryDto: UpdateCategoryDto,
        @Param('_id') _id: string) {
        this.clientAdminBackend.emit('update-category',
            { id: _id, category: updateCategoryDto })
    }


}
