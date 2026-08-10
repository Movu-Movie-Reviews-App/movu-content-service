import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { TmdbSyncService } from './tmdb-sync.service';
import { TmdbSyncController } from './tmdb-sync.controller';
import { TmdbModule } from 'src/apis/tmdb/tmdb.module';
import { MoviesService } from 'src/movies/movies.service';
import { MoviesModule } from 'src/movies/movies.module';
import { SeriesModule } from 'src/series/series.module';
import { GenresModule } from 'src/genres/genres.module';
import { ContentModule } from 'src/content/content.module';

@Module({
  controllers: [TmdbSyncController],
  providers: [TmdbSyncService],
  imports: [TmdbModule, MoviesModule, SeriesModule, GenresModule, ContentModule, ConfigModule, AuthModule]
})
export class TmdbSyncModule { }
