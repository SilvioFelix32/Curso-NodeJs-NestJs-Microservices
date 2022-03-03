import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'

const logger = new Logger('Main')
const configService = new ConfigService()

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      //urls: ['amqp://user:q7W2UQk249gR@18.210.17.173:5672/smartranking'],
      urls: [`amqp://${configService.get<string>('RABBITMQ_USER')}:${configService.get<string>('RABBITMQ_PASSWORD')}@${configService.get<string>('RABBITMQ_URL')}`],
      noAck: false,
      queue: 'desafios'
    },
  });

  await app.listen();
}
bootstrap();
