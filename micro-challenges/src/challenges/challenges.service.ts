import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Challenges } from './interfaces/challenges.interface';
import { ChallengeStatus } from './challenges-status.enum';

@Injectable()
export class ChallengesService {

    constructor(
        @InjectModel('Challenge') private readonly challengeModel: Model<Challenges>,
    ) { }

    private readonly logger = new Logger(ChallengesService.name)

    async createChallenge(challenge: Challenges): Promise<Challenges> {
        try {
            const challengeCreated = new this.challengeModel(challenge)
            challengeCreated.dateTimeSolicitation = new Date()
            /*
                Quando um desafio for criado, definimos o status 
                desafio como pendente
            */
            challengeCreated.status = ChallengeStatus.PENDING
            this.logger.log(`desafioCriado: ${JSON.stringify(challengeCreated)}`)
            return await challengeCreated.save()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }

    }

    async getAllChallenges(): Promise<Challenges[]> {
        try {
            return await this.challengeModel.find().exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async getChallengesFromOnePlayer(_id: any): Promise<Challenges[] | Challenges> {
        try {
            return await this.challengeModel.find()
                .where('players')
                .in(_id)
                .exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }

    }

    async getChallengesById(_id: any): Promise<Challenges> {
        try {
            return await this.challengeModel.findOne({ _id })
                .exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }

    }

    async updateChallenge(_id: string, challenge: Challenges): Promise<void> {
        try {
            /*
                Atualizaremos a data da resposta quando o status do desafio 
                vier preenchido 
            */
            challenge.dateTimeResponse = new Date()
            await this.challengeModel.findOneAndUpdate({ _id }, { $set: challenge }).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async updateChallengeMatch(matchId: string, challenge: Challenges): Promise<void> {
        try {
            /*
                Quando uma partida for registrada por um usuário, mudaremos o 
                status do desafio para realizado
            */
            challenge.status = ChallengeStatus.ACCOMPLISHED
            challenge.match = matchId
            await this.challengeModel.findOneAndUpdate({ _id: challenge._id }, { $set: challenge }).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async deleteChallenge(challenge: Challenges): Promise<void> {
        try {
            const { _id } = challenge
            /*
                Realizaremos a deleção lógica do desafio, modificando seu status para
                CANCELADO
            */
            challenge.status = ChallengeStatus.CALLEDOFF
            this.logger.log(`desafio: ${JSON.stringify(challenge)}`)
            await this.challengeModel.findOneAndUpdate({ _id }, { $set: challenge }).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

}
