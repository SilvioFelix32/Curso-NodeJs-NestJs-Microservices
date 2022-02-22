import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/Players/players.service';
import { AssingMatchChallengeDto } from './dtos/assing-match-challenge.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenges, Match } from './interfaces/challenges.interface';

@Injectable()
export class ChallengesService {

    constructor(
        @InjectModel('Challenges') private readonly challengeModel: Model<Challenges>,
        @InjectModel('Match') private readonly matchModel: Model<Match>,
        private readonly playersService: PlayersService,
        private readonly categoriesService: CategoriesService) { }

    private readonly logger = new Logger(ChallengesService.name)

    async createChallenge(createChallengeDto: CreateChallengeDto): Promise<Challenges> {
        const players = await this.playersService.getAllPlayers()

        createChallengeDto.players.map(playerDto => {
            const filteredPlayer = players.filter(player => player._id == playerDto._id)

            if (filteredPlayer.length === 0) {
                throw new BadRequestException(`O id ${playerDto._id} não é um jogador!`)
            }
        })

        const requesterIsAPlayerFromTheMatch =
            createChallengeDto.players.filter(
                player => player._id == createChallengeDto.requester)

        this.logger.log(`requesterIsAPlayerFromTheMatch: ${requesterIsAPlayerFromTheMatch} `)

        if (requesterIsAPlayerFromTheMatch.length == 0) {
            throw new BadRequestException(`O solicitante deve ser um jogador da partida!`)
        }

        const playerCategory = await this.categoriesService.getPlayerCategory(createChallengeDto.requester)

        if (!playerCategory) {
            throw new BadRequestException(`O solicitante precisa estar registrado em uma categoria!`)
        }

        const createdChallenge = new this.challengeModel(createChallengeDto)
        createdChallenge.category = playerCategory.category
        createdChallenge.dateTimeChallenge = new Date()

        createdChallenge.status = ChallengeStatus.PENDING
        this.logger.log(`createdChallenge: ${JSON.stringify(createdChallenge)} `)
        return await createdChallenge.save()
    }

    async getAllChallenges(): Promise<Array<Challenges>> {
        return await this.challengeModel.find()
            .populate('requester')
            .populate('players')
            .populate('match')
            .exec()
    }

    async getChallengesFromOnePlayer(_id: any): Promise<Array<Challenges>> {
        const players = await this.playersService.getAllPlayers()

        const filterPlayer = players.filter(player => player._id == _id)

        if (filterPlayer.length == 0) {
            throw new BadRequestException(`O id ${_id} não é um jogador!`)
        }

        return await this.challengeModel.find()
            .where('players')
            .in(_id)
            .populate('requester')
            .populate('players')
            .populate('match')
            .exec()
    }

    async updateChallenge(_id: string, updateChallengeDto: UpdateChallengeDto): Promise<void> {
        const challengeFound = await this.challengeModel.findById(_id).exec()

        if (!challengeFound) {
            throw new NotFoundException(`Desafio ${_id} não cadastrado!`)
        }

        if (updateChallengeDto.status) {
            challengeFound.dateTimeResponse = new Date()
        }
        challengeFound.status = updateChallengeDto.status
        challengeFound.dateTimeChallenge = updateChallengeDto.dateTimeChallenge

        await this.challengeModel.findOneAndUpdate({ _id }, { $set: challengeFound }).exec()
    }

    async assingMatchChallenge(_id: string, assingMatchChallengeDto: AssingMatchChallengeDto): Promise<void> {
        const challengeFound = await this.challengeModel.findById(_id).exec()

        if (!challengeFound) {
            throw new BadRequestException(`Desaio ${_id} não cadasftrado!`)
        }

        const filterPlayer = challengeFound.players.filter(player => player._id == assingMatchChallengeDto.def)

        this.logger.log(`challengeFound: ${challengeFound}`)
        this.logger.log(`filterPlayer:${filterPlayer}`)

        if (filterPlayer.length == 0) {
            throw new BadRequestException(`O jogador vencedor não faz parte do desafio!`)
        }

        const matchCreated = new this.matchModel(assingMatchChallengeDto)
        matchCreated.category = challengeFound.category
        matchCreated.players = challengeFound.players

        const result = await matchCreated.save()
        challengeFound.status = ChallengeStatus.ACCOMPLISHED
        challengeFound.match = result._id

        try {
            await this.challengeModel.findOneAndUpdate({ _id }, { $set: challengeFound }).exec()
        } catch (error) {
            await this.matchModel.deleteOne({ _id: result._id }).exec();
            throw new InternalServerErrorException()
        }
    }

    async deleteChallenge(_id: string): Promise<void> {

        const challengeFound = await this.challengeModel.findById(_id).exec()

        if (!challengeFound) {
            throw new BadRequestException(`Desafio ${_id} não cadastrado!`)
        }

        challengeFound.status = ChallengeStatus.CALLEDOFF

        await this.challengeModel.findOneAndUpdate({ _id }, { $set: challengeFound }).exec()

    }

}

