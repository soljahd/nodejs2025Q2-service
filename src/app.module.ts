import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [SharedModule, UsersModule, TracksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
