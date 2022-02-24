import { Body, Controller, Get, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RABBITMQ_URL_CONNECTOR } from './baseUrl';
import { CreateCategoryDto } from './dtos/create-category.dto';
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
    return this.clientAdminBackend.emit('create-category', createCategoryDto)
  }
}
