import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { Category } from './interfaces/category.interface';

const ackErrors: string[] = ['E11000']
@Controller('api/v1/categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) { }

    logger = new Logger(CategoriesController.name)

    @EventPattern('create-category')
    async createCategory(
        @Payload() category: Category, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const orginalMessage = context.getMessage()

        this.logger.log(`category: ${JSON.stringify(category)}`)

        try {
            await this.categoriesService.createCategory(category)
            await channel.ack(orginalMessage)
        } catch (error) {
            this.logger.error(`error ${JSON.stringify(error.message)}`)

            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError)
            )

            if (filterAckError) {
                await channel.ack(orginalMessage)
            }
        }

    }

    @MessagePattern('get-categories')
    async getCategories(@Payload() _id: string, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const orginalMessage = context.getMessage()

        try {
            if (_id) {
                return await this.categoriesService.getCategoryById(_id)
            } else {
                return await this.categoriesService.getAllCategoies()
            }
        } finally {
            await channel.ack(orginalMessage)
        }
    }

    @EventPattern('update-category')
    async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const orginalMessage = context.getMessage()

        this.logger.log(`data: ${JSON.stringify(data)}`)

        try {
            const _id: string = data.id
            const category: Category = data.category
            await this.categoriesService.updateCategory(_id, category)
            await channel.ack(orginalMessage)
        } catch (error) {

            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError)
            )

            if (filterAckError) {
                await channel.ack(orginalMessage)
            }
        }
    }
}
