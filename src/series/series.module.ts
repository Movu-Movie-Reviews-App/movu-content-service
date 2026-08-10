import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesEntity } from './entities/series.entity';
import { GenreEntity } from 'src/genres/entities/genre.entity';
import { ContentModule } from 'src/content/content.module';

@Module({
  controllers: [SeriesController],
  providers: [SeriesService],
  imports: [ContentModule, TypeOrmModule.forFeature([SeriesEntity, GenreEntity])],
  exports: [SeriesService],
})
export class SeriesModule { }
