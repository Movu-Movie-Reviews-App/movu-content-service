import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findTopRatedOfTheWeek(findContentDto: FindContentDto) {

    const { contentType, page = 1, limit = 4 } = findContentDto;

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const { count } = await this.weeklyRatedQuery(since, contentType)
      .select('COUNT(DISTINCT content.id)', 'count')
      .getRawOne();

    const totalItems = Number(count);

    const rankedRows = await this.weeklyRatedQuery(since, contentType)
      .select('content.id', 'id')
      .addSelect('AVG(review.rating)', 'weeklyRating')
      .addSelect('COUNT(review.id)', 'weeklyReviewsCount')
      .groupBy('content.id')
      .orderBy('"weeklyRating"', 'DESC')
      .addOrderBy('"weeklyReviewsCount"', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();

    const contents = rankedRows.length
      ? await this.contentRepository.find({
        where: { id: In(rankedRows.map((row) => row.id)) },
        relations: { genres: true }
      })
      : [];

    const contentById = new Map(contents.map((content) => [content.id, content]));



    // find() ignores the ranking, so rebuild the order from the ranked rows.
    const data = rankedRows
      .filter((row) => contentById.has(row.id))
      .map((row) => ({
        ...contentById.get(row.id)!,
        weeklyRating: Number(row.weeklyRating),
        weeklyReviewsCount: Number(row.weeklyReviewsCount)
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

  private weeklyRatedQuery(since: Date, contentType?: ContentTypeEnum) {

    const query = this.contentRepository.createQueryBuilder('content')
      .innerJoin('content.reviews', 'review')
      .where('review.createdAt >= :since', { since });

    if (contentType) {
      query.andWhere('content.type = :contentType', { contentType });
    }

    return query;
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
