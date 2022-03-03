import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices';
import { ChallengesService } from './challenges.service';
import { Challenges } from './interfaces/challenges.interface';

const ackErrors: string[] = ['E11000']

@Controller()
export class ChallengesController {

    constructor(private readonly challengesService: ChallengesService) { }

    private readonly logger = new Logger(ChallengesController.name)

    @EventPattern('create-challenge')
    async createChallenge(@Payload() challenge: Challenges, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            this.logger.log(`desafio: ${JSON.stringify(challenge)}`)
            await this.challengesService.createChallenge(challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError))
            if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
            }
        }
    }

    @MessagePattern('get-challenges')
    async getChallenges(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ): Promise<Challenges[] | Challenges> {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            const { PlayerId, _id } = data
            this.logger.log(`data: ${JSON.stringify(data)}`)
            if (PlayerId) {
                return await this.challengesService.getChallengesFromOnePlayer(PlayerId);
            } else if (_id) {
                return await this.challengesService.getChallengesById(_id)
            } else {
                return await this.challengesService.getAllChallenges();
            }
        } finally {
            await channel.ack(originalMsg)
        }
    }

    @EventPattern('update-challenge')
    async updateChallenge(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            this.logger.log(`data: ${JSON.stringify(data)}`)
            const _id: string = data.id
            const challenge: Challenges = data.challenge
            await this.challengesService.updateChallenge(_id, challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError))
            if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
            }
        }
    }

    @EventPattern('update-match-challenge')
    async updateMatchChallenge(
        @Payload() data: any,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            this.logger.log(`matchId: ${data}`)
            const matchId: string = data.matchId
            const challenge: Challenges = data.challenge
            await this.challengesService.updateChallengeMatch(matchId, challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError))
            if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
            }
        }
    }

    @EventPattern('delete-challenge')
    async deleteChallenge(@Payload() challenge: Challenges, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        try {
            await this.challengesService.deleteChallenge(challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(
                ackError => error.message.includes(ackError))
            if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
            }
        }
    }

}
