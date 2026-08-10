import { Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SeriesEntity } from './entities/series.entity';
import { Repository } from 'typeorm';
import { GenreEntity } from 'src/genres/entities/genre.entity';
import { ContentFactoryService } from '../content/content-factory.service';
import { CreateContentDto } from 'src/content/dto/create-content.dto';

@Injectable()
export class SeriesService {


  constructor(
    @InjectRepository(SeriesEntity)
    private readonly seriesRepository: Repository<SeriesEntity>,
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>,
    private readonly contentFactoryService: ContentFactoryService,
  ) { }



  async createSeries(createContentDto: CreateContentDto) {

    return this.contentFactoryService.createOrUpdateSeries(createContentDto);

  }

  async createOrUpdateSeries(seriesData: CreateSeriesDto) {

    const existingSeries = await this.seriesRepository.findOneBy({ id: seriesData.id });

    if (existingSeries) {
      return this.seriesRepository.save({ ...existingSeries, ...seriesData });
    }

    const series = this.seriesRepository.create(seriesData);
    return await this.seriesRepository.save(series);

  }

  async findOne(id: string, userId?: string) {
    const series = await this.seriesRepository.findOne({
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

    if (!series) {
      return series;
    }



    return { ...series };
  }

}
