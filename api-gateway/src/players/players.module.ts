import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [ProxyRMQModule, AwsModule],
  controllers: [PlayersController],
})

export class PlayersModule { }
