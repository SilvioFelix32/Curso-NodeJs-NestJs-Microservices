import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { History, RankingResponse } from './interfaces/ranking-response.interface';
import { Challenges } from './interfaces/challenge.interface';
import { Category } from './interfaces/category.interface';
import { Match } from './interfaces/match.interface';
import { EventName } from './event-name.enum';
import { Ranking } from './interfaces/ranking.schema';
import { RpcException } from '@nestjs/microservices';
import * as momentTimezone from 'moment-timezone'
import * as _ from 'lodash'

@Injectable()
export class RankingsService {

    constructor(
        @InjectModel('Ranking') private readonly challengeModel: Model<Ranking>,
        private clientProxySmartRanking: ClientProxySmartRanking
    ) { }

    private readonly logger = new Logger(RankingsService.name)

    private clientAdminBackend =
        this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

    private clientDesafios =
        this.clientProxySmartRanking.getClientProxyChallengesInstance()

    async processMatch(matchId: string, match: Match): Promise<void> {

        try {

            const category: Category = await this.clientAdminBackend.send('get-categories',
                match.category).toPromise()

            await Promise.all(match.players.map(async player => {

                const ranking = new this.challengeModel()

                ranking.category = match.category
                ranking.challenge = match.challenge
                ranking.match = matchId
                ranking.player = player

                if (player == match.def) {

                    const eventFilter = category.events.filter(
                        event => event.name == EventName.VICTORY
                    )

                    ranking.event = EventName.VICTORY
                    ranking.operation = eventFilter[0].operation
                    ranking.points = eventFilter[0].value

                } else {

                    const eventFilter = category.events.filter(
                        event => event.name == EventName.DEFEAT
                    )

                    ranking.event = EventName.DEFEAT
                    ranking.operation = eventFilter[0].operation
                    ranking.points = eventFilter[0].value

                }

                this.logger.log(`ranking: ${JSON.stringify(ranking)}`)

                await ranking.save()

            }))

        } catch (error) {

            this.logger.error(`error: ${error}`)
            throw new RpcException(error.message)

        }

    }

    async getRankings(categoryId: any, dataRef: string): Promise<RankingResponse[] | RankingResponse> {

        try {

            this.logger.log(`categoryId: ${categoryId} dataRef: ${dataRef}`)

            if (!dataRef) {

                dataRef = momentTimezone().tz("America/Sao_Paulo").format('YYYY-MM-DD')
                this.logger.log(`dataRef: ${dataRef}`)

            }

            /*
                Recuperou os registros de partidas processadas, filtrando a categoria recebida
                na requisição.
            */
            const rankingRegister = await this.challengeModel.find()
                .where('category')
                .equals(categoryId)
                .exec()

            /*
                Agora vamos recuperar todos os desafios com data menor
                ou igual à data que recebemos na requisição.
                Somente iremos recuperar desafios que estiverem com o status igual 
                a 'REALIZADO' e filtrando a categoria.
            */

            const challenges: Challenges[] = await this.clientDesafios.send('get-challenges-done',
                { categoryId: categoryId, dataRef: dataRef }).toPromise()

            /*
                Realizaremos um loop nos registros que recuperamos do ranking (partidas processadas)
                e descartaremos os registros (com base no id do desafio) que não retornaram no
                objeto desafios
            */

            _.remove(rankingRegister, function (item) {
                return challenges.filter(challenge => challenge._id == item.challenge).length == 0
            })

            this.logger.log(`rankingRegister: ${JSON.stringify(rankingRegister)}`)

            //Agrupar por jogador

            const result =
                _(rankingRegister)
                    .groupBy('player')
                    .map((items, key) => ({
                        'player': key,
                        'history': _.countBy(items, 'event'),
                        'points': _.sumBy(items, 'points')
                    }))
                    .value()

            const orderedResut = _.orderBy(result, 'points', 'desc')

            this.logger.log(`orderedResut: ${JSON.stringify(orderedResut)}`)

            const rankingResponseList: RankingResponse[] = []

            orderedResut.map(function (item, index) {

                const rankingResponse: RankingResponse = {}

                rankingResponse.player = item.players
                rankingResponse.position = index + 1
                rankingResponse.punctuation = item.points

                const history: History = {}

                history.wins = item.history.VICTORY ? item.history.VICTORY : 0
                history.defeats = item.history.DEFEAT ? item.history.DEFEAT : 0
                rankingResponse.matchesHistory = history

                rankingResponseList.push(rankingResponse)

            })

            return rankingResponseList

        } catch (error) {

            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)

        }

    }

}
