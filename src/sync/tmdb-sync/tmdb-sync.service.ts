import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { TmdbService } from 'src/apis/tmdb/tmdb.service';
import { MoviesService } from 'src/movies/movies.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { Movie } from 'src/common/interfaces/movie.interface';
import { TmdbSyncPaginationDto } from './dto/tmdb-sync-pagination.dto';
import { GenresService } from 'src/genres/genres.service';
import { ContentFactoryService } from 'src/content/content-factory.service';
import { ContentEntity } from 'src/content/entities/content.entity';
import { ContentCreditEntity } from 'src/content/entities/content-credit';
import { MovieEntity } from 'src/movies/entities/movie.entity';
import { SeriesEntity } from 'src/series/entities/series.entity';
import { GenreEntity } from 'src/genres/entities/genre.entity';
import { PersonEntity } from 'src/person/entities/person.entity';
import { ReviewEntity } from 'src/review/entities/review.entity';
import { WishlistEntity } from 'src/wishlist/entities/wishlist.entity';
import { FavoriteEntity } from 'src/favorite/entities/favorite.entity';

/**
 * Every table wiped by clearSyncedData. Reviews, wishlist and favorites are
 * user data, not synced data, but they hold a NOT NULL foreign key to content,
 * so they cannot survive a content wipe. Users themselves are never touched.
 */
const SYNCED_ENTITIES: EntityTarget<ObjectLiteral>[] = [
  ContentCreditEntity,
  MovieEntity,
  SeriesEntity,
  ReviewEntity,
  WishlistEntity,
  FavoriteEntity,
  ContentEntity,
  PersonEntity,
  GenreEntity,
];

@Injectable()
export class TmdbSyncService {

  constructor(
    private readonly tmdbService: TmdbService,
    private readonly moviesService: MoviesService,
    private readonly genresService: GenresService,
    private readonly contentFactory: ContentFactoryService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
  }


  async syncAll(pagination: TmdbSyncPaginationDto) {
    // Genres first: movies and series reference genreIds.
    const movieGenres = await this.syncMovieGenres();
    const seriesGenres = await this.syncSeriesGenres();
    const popularMovies = await this.syncPopularMovies(pagination);
    const popularSeries = await this.syncPopularSeries(pagination);

    return { movieGenres, seriesGenres, popularMovies, popularSeries };
  }

  async clearSyncedData() {

    this.ensureClearingIsAllowed();

    const tables = SYNCED_ENTITIES.map((entity) => this.dataSource.getMetadata(entity).tableName);

    const deletedRows: Record<string, number> = {};

    for (const entity of SYNCED_ENTITIES) {
      const metadata = this.dataSource.getMetadata(entity);
      deletedRows[metadata.tableName] = await this.dataSource.getRepository(entity).count();
    }

    // CASCADE also empties the content/genre join table, which no entity owns.
    await this.dataSource.query(
      `TRUNCATE TABLE ${tables.map((table) => `"${table}"`).join(', ')} RESTART IDENTITY CASCADE`
    );

    return {
      deletedRows,
      message: 'Successfully cleared all synced data. Reviews, wishlist and favorites were wiped too; users were kept.'
    };
  }

  private ensureClearingIsAllowed() {

    const environment = this.configService.get('app.environment');

    if (environment === 'prod' || environment === 'production') {
      throw new ForbiddenException('Clearing synced data is disabled in production environments');
    }
  }

  async syncMovieGenres() {
    const genres = await this.tmdbService.getMovieGenres()

    for (const genre of genres) {
      await this.genresService.createOrUpdateGenre(genre);
    }

    return {
      totalSynced: genres.length,
      message: `Successfully synced ${genres.length} movie genres`
    }
  }

  async syncSeriesGenres() {
    const genres = await this.tmdbService.getSeriesGenres();

    for (const genre of genres) {
      await this.genresService.createOrUpdateGenre(genre);
    }

    return {
      totalSynced: genres.length,
      message: `Successfully synced ${genres.length} series genres`
    }
  }

  async syncPopularSeries({ page = 1, maxPages = 1 }: TmdbSyncPaginationDto) {

    let totalSynced = 0;

    for (let currentPage = page; currentPage <= maxPages; currentPage++) {
      try {
        const populars = await this.tmdbService.getPopularSeries(currentPage);

        for (const popular of populars) {
          const series = await this.tmdbService.getSeriesWithCredits(popular.tmdbId);
          await this.contentFactory.createOrUpdateSeries(series);
          totalSynced++;
        }

      } catch (error) {
        console.error(`Failed to sync popular series at page ${currentPage}`, error);
      }
    }

    return {
      totalSynced,
      message: `Successfully synced ${totalSynced} popular series from pages ${page} to ${maxPages}`
    };
  }

  async syncPopularMovies({ page = 1, maxPages = 1 }: TmdbSyncPaginationDto) {

    let totalSynced = 0;

    for (let currentPage = page; currentPage <= maxPages; currentPage++) {
      try {
        const populars = await this.tmdbService.getPopularMovies(currentPage);

        for (const popular of populars) {
          const movie = await this.tmdbService.getMovieWithCredits(popular.tmdbId);
          await this.contentFactory.createOrUpdateMovie(movie);
          totalSynced++;
        }

      } catch (error) {
        console.error(`Failed to sync popular movies at page ${currentPage}`, error);
      }
    }

    return {
      totalSynced,
      message: `Successfully synced ${totalSynced} popular movies from pages ${page} to ${maxPages}`
    };
  }
}
