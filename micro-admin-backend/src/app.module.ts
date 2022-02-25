import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGOOSE_BASEURL } from './baseUrl';
import { CategoriesModule } from './Categories/categories.module';
import { PlayersModule } from './Players/players.module';
@Module({
  imports: [MongooseModule.forRoot(MONGOOSE_BASEURL,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }),
    CategoriesModule,
    PlayersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
