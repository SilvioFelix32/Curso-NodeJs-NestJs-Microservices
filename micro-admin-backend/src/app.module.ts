import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGOOSE_BASEURL } from './baseUrl';
import { CategorySchema } from './Categories/interfaces/category.schema';
import { PlayerSchema } from './Players/interfaces/player.schema';

@Module({
  imports: [MongooseModule.forRoot(MONGOOSE_BASEURL),
  MongooseModule.forFeature([
    { name: 'Category', schema: CategorySchema },
    { name: 'Player', schema: PlayerSchema }
  ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
