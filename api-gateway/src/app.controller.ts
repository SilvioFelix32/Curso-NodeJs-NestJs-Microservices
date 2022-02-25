import { Body, Controller, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RABBITMQ_URL_CONNECTOR } from './baseUrl';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
@Controller('api/v1')
export class AppController {

  private logger = new Logger(AppController.name)

  private clientAdminBackend: ClientProxy

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL_CONNECTOR],
        queue: 'admin-backend'
      }
    })
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  CreateCategory(
    @Body() createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto)
  }

  @Get('categories')
  getCategories(
    @Query('categoryId') _id: string): Observable<any> {
    return this.clientAdminBackend.send('get-categories', _id ? _id : '')
  }

  @Put('categories/:_id')
  @UsePipes(ValidationPipe)
  updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('_id') _id: string) {
    this.clientAdminBackend.emit('update-category',
      { id: _id, category: updateCategoryDto })
  }
}
