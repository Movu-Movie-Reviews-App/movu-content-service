import { Controller } from '@nestjs/common';
import { TmdbSyncService } from './tmdb-sync.service';

import { TmdbSyncPaginationDto } from './dto/tmdb-sync-pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class TmdbSyncController {
  constructor(private readonly tmdbSyncService: TmdbSyncService) { }

  @MessagePattern('sync.all')
  syncAll(@Payload() queryParameters: TmdbSyncPaginationDto) {
    return this.tmdbSyncService.syncAll(queryParameters);
  }

  @MessagePattern('sync.movieGenres')
  syncMovieGenres() {
    return this.tmdbSyncService.syncMovieGenres();
  }

  @MessagePattern('sync.seriesGenres')
  syncSeriesGenres() {
    return this.tmdbSyncService.syncSeriesGenres();
  }

  @MessagePattern('sync.popularMovies')
  syncPopularMovies(@Payload() queryParameters: TmdbSyncPaginationDto) {
    return this.tmdbSyncService.syncPopularMovies(queryParameters);
  }

  @MessagePattern('sync.popularSeries')
  syncPopularSeries(@Payload() queryParameters: TmdbSyncPaginationDto) {
    return this.tmdbSyncService.syncPopularSeries(queryParameters);
  }

  @MessagePattern('sync.clear')
  clearSyncedData() {
    return this.tmdbSyncService.clearSyncedData();
  }



}
