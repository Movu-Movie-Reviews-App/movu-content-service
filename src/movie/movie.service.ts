import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { GenreEntity } from 'src/genres/entities/genre.entity';
import { ContentFactoryService } from '../content/content-factory.service';
import { CreateContentDto } from 'src/content/dto/create-content.dto';

@Injectable()
export class MoviesService {


  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    private readonly contentFactoryService: ContentFactoryService,
  ) { }



  async createMovie(createContentDto: CreateContentDto) {

    return this.contentFactoryService.createOrUpdateMovie(createContentDto);

  }

  async createOrUpdateMovie(movieData: CreateMovieDto) {

    const existingMovie = await this.movieRepository.findOneBy({ id: movieData.id });

    if (existingMovie) {
      return this.movieRepository.save({ ...existingMovie, ...movieData });
    }

    const movie = this.movieRepository.create(movieData);
    return await this.movieRepository.save(movie);

  }

  async findOne(id: string, userId?: string) {
    const movie = await this.movieRepository.findOne({
      where: { content: { id } },
      relations: {
        content: {
          genres: true,
          contentCredits: {
            person: true
          }
        }
      }
    });

    if (!movie) {
      return movie;
    }

    return { ...movie };
  }

}
