import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { GenreEntity } from './entities/genre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GenreEntity])],
  controllers: [GenresController],
  providers: [GenresService],
  exports: [GenresService]
})
export class GenresModule { }
