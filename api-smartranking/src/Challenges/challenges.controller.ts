import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AssingMatchChallengeDto } from './dtos/assing-match-challenge.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenges } from './interfaces/challenges.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {

    constructor(private readonly challengesService: ChallengesService) { }
    private readonly logger = new Logger(ChallengesController.name)

    @Post()
    @UsePipes(ValidationPipe)
    async createChallenge(
        @Body() createChallengeDto: CreateChallengeDto): Promise<Challenges> {
        this.logger.log(`createChallengeDto: ${JSON.stringify(createChallengeDto)}`)
        return await this.challengesService.createChallenge(createChallengeDto)
    }

    @Get()
    async getChallenges(
        @Query('playerId') _id: string): Promise<Array<Challenges>> {
        return _id ? await this.challengesService.getChallengesFromOnePlayer(_id)
            : await this.challengesService.getAllChallenges()
    }

    @Put('/challenge')
    async updateChallenge(
        @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
        @Param('challenge') _id: string): Promise<void> {
        await this.challengesService.updateChallenge(_id, updateChallengeDto)
    }

    @Post('/:challenge/match/')
    async assingMatchChallenge(
        @Body(ValidationPipe) assingMatchChallengeDto: AssingMatchChallengeDto,
        @Param('challenge') _id: string): Promise<void> {
        return await this.challengesService.assingMatchChallenge(_id, assingMatchChallengeDto)
    }

    @Delete('/:_id')
    async deleteChallenge(
        @Param('_id') _id: string): Promise<void> {
        await this.challengesService.deleteChallenge(_id)
    }

}
