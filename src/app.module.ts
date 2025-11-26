import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [
    SharedModule,
    UsersModule,
    ArtistsModule,
    TracksModule,
    AlbumsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
