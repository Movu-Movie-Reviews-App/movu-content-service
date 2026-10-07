import { Module } from '@nestjs/common';
import { TmdbSyncService } from './tmdb-sync.service';
import { TmdbSyncController } from './tmdb-sync.controller';
import { TmdbModule } from 'src/apis/tmdb/tmdb.module';
import { SeriesModule } from 'src/series/series.module';
import { GenresModule } from 'src/genres/genres.module';
import { ContentModule } from 'src/content/content.module';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  controllers: [TmdbSyncController],
  providers: [TmdbSyncService],
  imports: [TmdbModule, MovieModule, SeriesModule, GenresModule, ContentModule]
})
export class TmdbSyncModule { }
