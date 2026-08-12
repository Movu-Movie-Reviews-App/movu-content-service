import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { REVIEW_SERVICE } from 'src/config';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentEntity } from './entities/content.entity';
import { In, Repository } from 'typeorm';
import { GenresService } from 'src/genres/genres.service';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';
import { FindContentDto } from './dto/find-content.dto';
import { ContentSortEnum } from './enums/content-sort.enum';

@Injectable()
export class ContentService {

  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,
    private readonly genresService: GenresService,
    @Inject(REVIEW_SERVICE)
    private readonly reviewClient: ClientProxy,


  ) { }


  async create(createContentDto: CreateContentDto) {

    const genres = await this.genresService.findAllByTmdbIds(createContentDto.genreIds!, createContentDto.type!);

    const content = this.contentRepository.create({ ...createContentDto, genres: genres });
    return await this.contentRepository.save(content);

  }


  async getContentByGenre(contentType: ContentTypeEnum) {

    const [genres, contents] = await Promise.all([
      this.genresService.findAllByType(contentType),
      this.contentRepository.find({
        where: { type: contentType },
        relations: { genres: true }
      })
    ]);



    const contentByGenre = genres.map((genre) => ({
      genre: genre.name,
      slug: genre.slug,
      content: contents
        .filter((content) => content.genres.some((g) => g.id === genre.id))
        .map((content) => ({
          ...content
        }))
    }));

    return { contentByGenre };

  }


  async findAll(findContentDto: FindContentDto) {

    const { contentType, sortBy, genreSlug, search, page = 1, limit = 20 } = findContentDto;

    const query = this.contentRepository.createQueryBuilder('content')
      .leftJoinAndSelect('content.genres', 'genre');

    if (contentType) {
      query.andWhere('content.type = :contentType', { contentType });
    }

    if (search) {
      query.andWhere('content.title ILIKE :search', { search: `%${search}%` });
    }

    if (genreSlug && genreSlug !== 'all') {
      query.andWhere('genre.slug = :genreSlug', { genreSlug });
    }

    switch (sortBy) {
      case ContentSortEnum.NEWEST:
        query.orderBy('content.releaseDate', 'DESC');
        break;
      case ContentSortEnum.OLDEST:
        query.orderBy('content.releaseDate', 'ASC');
        break;
      case ContentSortEnum.HIGHEST_RATING:
        query.orderBy('content.averageRating', 'DESC');
        break;
      case ContentSortEnum.LOWEST_RATING:
        query.orderBy('content.averageRating', 'ASC');
        break;
      case ContentSortEnum.MOST_REVIEWED:
        query.orderBy('content.reviewsCount', 'DESC');
        break;
      case ContentSortEnum.LEAST_REVIEWED:
        query.orderBy('content.reviewsCount', 'ASC');
        break;
      case ContentSortEnum.ALPHABETICAL:
        query.orderBy('content.title', 'ASC');
        break;
      default:
        query.orderBy('content.title', 'ASC');
    }

    query
      .skip((page - 1) * limit)
      .take(limit);

    const [contents, total] = await query.getManyAndCount();

    return {
      data: contents,
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };

  }

  /**
   * Reviews live in review-service, behind its own database, so the ranking cannot
   * be a SQL join from here. review-service ranks by rating and returns contentIds;
   * this service hydrates them.
   */
  async findTopRatedOfTheWeek(findContentDto: FindContentDto) {

    const { contentType, page = 1, limit = 4 } = findContentDto;

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const { totalItems, ranking } = await firstValueFrom(
      this.reviewClient.send('reviews.weeklyTopRated', {
        since: since.toISOString(),
        page,
        limit,
      })
    );

    // ponytail: contentType filters after ranking, so a filtered page can come back
    // short and totalItems counts every type. Push the type filter into the ranking
    // (send the type's contentIds along) if that becomes visible in the UI.
    const contents = ranking.length
      ? await this.contentRepository.find({
        where: contentType
          ? { id: In(ranking.map((row) => row.contentId)), type: contentType }
          : { id: In(ranking.map((row) => row.contentId)) },
        relations: { genres: true }
      })
      : [];

    const contentById = new Map(contents.map((content) => [content.id, content]));

    // find() ignores the ranking, so rebuild the order from the ranked rows.
    const data = ranking
      .filter((row) => contentById.has(row.contentId))
      .map((row) => ({
        ...contentById.get(row.contentId)!,
        weeklyRating: row.weeklyRating,
        weeklyReviewsCount: row.weeklyReviewsCount
      }));

    return {
      data,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };

  }

  async findOne(contentId: string) {
    try {
      const content = await this.contentRepository.findOne({ where: { id: contentId } });
      if (!content) {
        throw new NotFoundException('Content not found');
      }
      return content;
    } catch (error) {

    }

  }

  update(id: number, updateContentDto: UpdateContentDto) {
    return `This action updates a #${id} content`;
  }

  remove(id: number) {
    return `This action removes a #${id} content`;
  }

  findReviewsByContent(contentId: string) {

  }

  async updateRatingStats(contentId: string, newRating: number, reviewsCount: number) {
    const content = await this.contentRepository.preload({
      id: contentId,
      averageRating: newRating,
      reviewsCount: reviewsCount
    });

    if (!content) {
      throw new NotFoundException(`Content with id ${contentId} not found`);
    }

    await this.contentRepository.save(content);

  }
}
