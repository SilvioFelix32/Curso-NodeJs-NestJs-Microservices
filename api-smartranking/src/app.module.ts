import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGOOSE_BASEURL } from 'baseUrl';

import { PlayersModule } from './Players/players.module';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './Challenges/challenges.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      MONGOOSE_BASEURL,
      /* {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUndefiedTopology: true,
        useFindAndModify: false,
      } */),
    PlayersModule,
    CategoriesModule,
    ChallengesModule],
  controllers: [],
  providers: [],
})

export class AppModule { }

