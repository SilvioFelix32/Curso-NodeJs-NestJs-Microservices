import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { AwsService } from 'src/aws/aws.service';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params.pipe';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {

    private logger = new Logger(PlayersController.name)

    constructor(
        private clientProxySmartRanking: ClientProxySmartRanking,
        private awsService: AwsService
    ) { }

    private clientAdminBackend =
        this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

    @Post()
    @UsePipes(ValidationPipe)
    async createPlayer(
        @Body() createPlayerDto: CreatePlayerDto) {

        this.logger.log(`createPlayerDto: ${JSON.stringify(createPlayerDto)}`)

        const category = this.clientAdminBackend.send('get-categories',
            createPlayerDto.category)

        if (category) {
            this.clientAdminBackend.emit('create-player', createPlayerDto)
        } else {
            throw new BadRequestException(`Categoria não cadastrada!`)
        }
    }

    @Post('/:_id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: any,
        @Param('_id') _id: string) {

        //Verificar se o jogador está cadastrado
        const player = this.clientAdminBackend.send('get-players', _id)

        if (!player) {
            throw new BadRequestException(`Jogador não encontrado!`)
        }

        //Enviar o arquivo para o S3 e recuperar a URL de acesso
        const playerPictureUrl = await this.awsService.uploadFile(file, _id)

        //Atualizar o atributo URL da entidade jogador
        const updatePlayerDto: UpdatePlayerDto = {}
        updatePlayerDto.playerPictureUrl = playerPictureUrl.url

        this.clientAdminBackend.emit('update-player', { id: _id, player: updatePlayerDto })

        //Retornar o jogador atualizado para o cliente
        return this.clientAdminBackend.send('get-players', _id)
    }


    @Get()
    consultarJogadores(@Query('playerId') _id: string): Observable<any> {

        return this.clientAdminBackend.send('get-players', _id ? _id : '')

    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(
        @Body() updatePlayerDto: UpdatePlayerDto,
        @Param('_id', ValidationParamsPipe) _id: string) {

        const category = this.clientAdminBackend.send('get-categories',
            updatePlayerDto.category)

        if (category) {
            this.clientAdminBackend.emit('update-player', { id: _id, player: updatePlayerDto })
        } else {
            throw new BadRequestException(`Categoria não cadastrada!`)
        }
    }

    @Delete('/:_id')
    async deletarPlayer(
        @Param('_id', ValidationParamsPipe) _id: string) {
        this.clientAdminBackend.emit('delete-player', { _id })
    }

}


