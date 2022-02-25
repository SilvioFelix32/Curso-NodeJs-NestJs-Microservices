import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

const ackErrors: string[] = ['E11000']
@Controller('api/v1/players')
export class PlayersController {

    logger = new Logger(PlayersController.name)
    constructor(private readonly playersService: PlayersService) { }

    @EventPattern('create-player')
    async criarPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            this.logger.log(`Player: ${JSON.stringify(player)}`)
            await this.playersService.createPlayer(player)
            await channel.ack(originalMessage)
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError))

            if (filterAckError.length > 0) {
                await channel.ack(originalMessage)
            }
        }
    }

    @MessagePattern('get-players')
    async consultarPlayeres(@Payload() _id: string, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            if (_id) {
                return await this.playersService.getPlayerById(_id);
            } else {
                return await this.playersService.getAllPlayers();
            }
        } finally {
            await channel.ack(originalMessage)
        }
    }

    @EventPattern('update-player')
    async atualizarPlayer(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        try {
            console.log(`data: ${JSON.stringify(data)}`)
            const _id: string = data.id
            const Player: Player = data.Player
            await this.playersService.updatePlayer(_id, Player)
            await channel.ack(originalMessage)
        } catch (error) {
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError))

            if (filterAckError.length > 0) {
                await channel.ack(originalMessage)
            }
        }
    }

    @EventPattern('delete-player')
    async deletarPlayer(@Payload() _id: string, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMesssage = context.getMessage()
        try {
            await this.playersService.deletePlayer(_id)
            await channel.ack(originalMesssage)
        } catch (error) {
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError))

            if (filterAckError.length > 0) {
                await channel.ack(originalMesssage)
            }
        }
    }


}


