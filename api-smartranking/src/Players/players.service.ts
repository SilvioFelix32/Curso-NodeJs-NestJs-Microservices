import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {

    constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) { }

    async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {

        const { email } = createPlayerDto

        const playerFound = await this.playerModel.findOne({ email }).exec();

        if (playerFound) {
            throw new BadRequestException(`jogador com e-mail ${email} já cadastrado`)
        }

        const playerCreated = new this.playerModel(createPlayerDto)
        return await playerCreated.save()
    }

    async updatePlayer(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {

        const playerFound = await this.playerModel.findOne({ _id }).exec();

        if (!playerFound) {
            throw new NotFoundException(`Jogador com ${_id} não encontrado`)
        }

        await this.playerModel.findOneAndUpdate({ _id },
            { $set: updatePlayerDto }).exec()
    }

    async getAllPlayers(): Promise<Player[]> {
        return await this.playerModel.find().exec();
    }

    async getPlayerById(_id: string): Promise<Player> {
        const playerFound = await this.playerModel.findOne({ _id }).exec();
        if (!playerFound) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`)
        }

        return playerFound
    }

    async deletePlayer(_id: string): Promise<any> {
        const playerFound = await this.playerModel.findOne({ _id }).exec();

        if (!playerFound) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`)
        }

        return await this.playerModel.deleteOne({ _id }).exec()
    }
}
