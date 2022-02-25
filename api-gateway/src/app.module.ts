import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './aws/aws.module';
import { CategoriessModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
@Module({
  imports: [
    CategoriessModule,
    PlayersModule,
    ProxyRMQModule,
    AwsModule,
    ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule { }
