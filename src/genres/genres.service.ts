import { Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreEntity } from './entities/genre.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';
import slugify from 'slugify';

@Injectable()
export class GenresService {

  constructor(
    @InjectRepository(GenreEntity)
    private readonly genreRepository: Repository<GenreEntity>

  ) { }


  async createOrUpdateGenre(genreData: CreateGenreDto) {

    const existingGenre = await this.genreRepository.findOneBy({
      tmdbId: genreData.tmdbId,
      contentType: genreData.contentType
    });

    if (existingGenre) {
      return await this.genreRepository.save({ ...existingGenre, ...genreData, slug: existingGenre.slug || slugify(genreData.name, { lower: true, strict: true }) });
    }

    const genre = this.genreRepository.create({ ...genreData, slug: slugify(genreData.name, { lower: true, strict: true }) });
    await this.genreRepository.save(genre);

  }

  findAll() {
    return this.genreRepository.find();
  }

  async findAllByType(contentType: ContentTypeEnum) {
    const genres = await this.genreRepository.find({ where: { contentType } });
    return genres;
  }

  findAllByTmdbIds(tmdbIds: number[], contentType: ContentTypeEnum) {
    return this.genreRepository.find({ where: { tmdbId: In(tmdbIds), contentType } });
  }

  findOneByType(tmdbId: number, contentType: ContentTypeEnum) {
    return this.genreRepository.findOneBy({ tmdbId: tmdbId, contentType: contentType });
  }

  findBySlug(slug: string, contentType: ContentTypeEnum) {
    return this.genreRepository.findOneBy({ slug: slug, contentType: contentType });
  }

  update(tmdbId: number, contentType: ContentTypeEnum, updateGenreDto: UpdateGenreDto) {
    return this.genreRepository.update({ tmdbId, contentType }, updateGenreDto);
  }


}
