import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ContentEntity } from './entities/content.entity';
import { MovieEntity } from '../movie/entities/movie.entity';
import { SeriesEntity } from '../series/entities/series.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { CreateContentCreditDto } from './dto/create-content-credit.dto';
import { GenresService } from '../genres/genres.service';
import { ContentTypeEnum } from '../common/enums/content-type.enum';
import { PersonEntity } from '../person/entities/person.entity';
import { ContentCreditEntity } from './entities/content-credit';
import slugify from 'slugify';

@Injectable()
export class ContentFactoryService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly genresService: GenresService,
    ) { }

    async createOrUpdateMovie(input: CreateContentDto): Promise<MovieEntity> {
        try {
            return await this.dataSource.transaction(async (manager) => {
                const content = await this.upsertContent(manager, input);
                const movie = await this.upsertMovie(manager, content, input.runtime);
                await this.upsertCredits(manager, content, input.credits ?? []);
                return movie;
            });
        } catch (error: any) {
            throw new InternalServerErrorException(
                'Failed to create or update movie and content',
                error.message,
            );
        }
    }

    async createOrUpdateSeries(input: CreateContentDto): Promise<SeriesEntity> {
        try {
            return await this.dataSource.transaction(async (manager) => {
                const content = await this.upsertContent(manager, {
                    ...input,
                    type: ContentTypeEnum.SERIES,
                });
                const series = await this.upsertSeries(manager, content, input);
                await this.upsertCredits(manager, content, input.credits ?? []);
                return series;
            });
        } catch (error: any) {
            throw new InternalServerErrorException(
                'Failed to create or update series and content',
                error.message,
            );
        }
    }

    private async upsertContent(
        manager: EntityManager,
        input: CreateContentDto,
    ): Promise<ContentEntity> {
        const genres = await this.genresService.findAllByTmdbIds(
            input.genreIds ?? [],
            input.type ?? ContentTypeEnum.MOVIE,
        );

        const data = {
            tmdbId: input.tmdbId,
            title: input.title,
            overview: input.overview,
            releaseDate: input.releaseDate,
            posterPath: input.posterPath,
            backdropUrl: input.backdropPath,
            popularity: input.popularity,
            adult: input.adult,
            type: input.type ?? ContentTypeEnum.MOVIE,
            genres,
        };

        const existing = await manager.findOne(ContentEntity, {
            where: { tmdbId: input.tmdbId },
        });

        const content = manager.create(ContentEntity, {
            ...data,
            id: existing?.id,
            slug: existing?.slug ?? slugify(input.title, { lower: true, strict: true }),
        });

        return manager.save(content);
    }

    private async upsertMovie(
        manager: EntityManager,
        content: ContentEntity,
        runtime?: number,
    ): Promise<MovieEntity> {
        const existing = await manager.findOne(MovieEntity, {
            where: { id: content.id },
        });

        const movie = manager.create(MovieEntity, {
            id: content.id,
            content,
            runtime: runtime ?? existing?.runtime ?? 0,
        });

        return manager.save(movie);
    }

    private async upsertSeries(
        manager: EntityManager,
        content: ContentEntity,
        input: CreateContentDto,
    ): Promise<SeriesEntity> {
        const existing = await manager.findOne(SeriesEntity, {
            where: { id: content.id },
        });

        const series = manager.create(SeriesEntity, {
            id: content.id,
            content,
            numberOfSeasons: input.numberOfSeasons ?? existing?.numberOfSeasons ?? 0,
            numberOfEpisodes: input.numberOfEpisodes ?? existing?.numberOfEpisodes ?? 0,
        });

        return manager.save(series);
    }

    private async upsertCredits(
        manager: EntityManager,
        content: ContentEntity,
        credits: CreateContentCreditDto[],
    ): Promise<void> {
        for (const credit of credits) {
            await this.upsertCredit(manager, content, credit);
        }
    }

    private async upsertCredit(
        manager: EntityManager,
        content: ContentEntity,
        credit: CreateContentCreditDto,
    ): Promise<void> {
        let person = await manager.findOne(PersonEntity, {
            where: { tmdbId: credit.person.tmdbId },
        });

        if (person) {
            manager.merge(PersonEntity, person, credit.person);
        } else {
            person = manager.create(PersonEntity, credit.person);
        }
        person = await manager.save(person);

        let contentCredit = await manager.findOne(ContentCreditEntity, {
            where: { content: { id: content.id }, person: { id: person.id } },
        });

        if (contentCredit) {
            manager.merge(ContentCreditEntity, contentCredit, { character: credit.character });
        } else {
            contentCredit = manager.create(ContentCreditEntity, {
                character: credit.character,
                person,
                content,
            });
        }
        await manager.save(contentCredit);
    }
}
