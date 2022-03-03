import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ClientProxySmartRanking {
  getClientProxyDesafiosInstance() {
    throw new Error('Method not implemented.')
  }

  constructor(
    private configService: ConfigService
  ) { }

  getClientProxyAdminBackendInstance(): ClientProxy {

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.configService.get<string>('RABBITMQ_USER')}:${this.configService.get<string>('RABBITMQ_PASSWORD')}@${this.configService.get<string>('RABBITMQ_URL')}`],
        queue: 'admin-backend'
      }
    })
  }

  getClientProxyChallengesInstance(): ClientProxy {

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.configService.get<string>('RABBITMQ_USER')}:${this.configService.get<string>('RABBITMQ_PASSWORD')}@${this.configService.get<string>('RABBITMQ_URL')}`],
        queue: 'challenges'
      }
    })
  }

  getClientProxyRankingsInstance(): ClientProxy {

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.configService.get<string>('RABBITMQ_USER')}:${this.configService.get<string>('RABBITMQ_PASSWORD')}@${this.configService.get<string>('RABBITMQ_URL')}`],
        queue: 'rankings'
      }
    })
  }


}
