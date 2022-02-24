import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Category } from './Categories/interfaces/category.interface';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  logger = new Logger(AppController.name)

  @EventPattern('create-category')
  async createCategory(
    @Payload() category: Category) {
    this.logger.log(`category: ${JSON.stringify(category)}`)
    await this.appService.createCategory(category)
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() _id: string) {
    if (_id) {
      return await this.appService.getCategoryById(_id)
    } else {
      return await this.appService.getAllCategoies()
    }
  }
}

