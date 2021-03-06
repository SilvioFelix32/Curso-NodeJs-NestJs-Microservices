import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices'
import { Logger } from '@nestjs/common';
import { RABBITMQ_URL_CONNECTOR } from './baseUrl';

const logger = new Logger('Main')

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL_CONNECTOR],
      noAck: false,
      queue: 'admin-backend'
    },
  });

  await app.listen();
}
bootstrap();




