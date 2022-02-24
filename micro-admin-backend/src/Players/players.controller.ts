import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';
import { ValidationParamsPipe } from '../Common/pipes/validation-params.pipe';

@Controller('api/v1/players')
export class PlayersController {

    constructor(private readonly playersService: PlayersService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async createPlayer(
        @Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
        return await this.playersService.createPlayer(createPlayerDto)
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async UpdatePlayer(
        @Body() updatePlayerDto: UpdatePlayerDto,
        @Param('_id', ValidationParamsPipe) _id: string): Promise<void> {
        await this.playersService.updatePlayer(_id, updatePlayerDto)
    }

    @Get()
    async getAllPlayers(): Promise<Player[]> {
        return await this.playersService.getAllPlayers();
    }

    @Get('/:_id')
    async getPlayerById(
        @Param('_id', ValidationParamsPipe) _id: string): Promise<Player> {
        return await this.playersService.getPlayerById(_id);
    }

    @Delete('/:_id')
    async deletePlayer(
        @Param('_id', ValidationParamsPipe) _id: string): Promise<void> {
        this.playersService.deletePlayer(_id)
    }

}


