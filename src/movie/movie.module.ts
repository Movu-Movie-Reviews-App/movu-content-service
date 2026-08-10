import { Module } from '@nestjs/common';
import { MoviesService } from './movie.service';
import { MoviesController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from './entities/movie.entity';
import { GenreEntity } from 'src/genres/entities/genre.entity';
import { ContentModule } from 'src/content/content.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [ContentModule, TypeOrmModule.forFeature([MovieEntity, GenreEntity])],
  exports: [MoviesService],
})
export class MovieModule { }
