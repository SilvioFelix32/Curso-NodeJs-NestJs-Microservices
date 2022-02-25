import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
