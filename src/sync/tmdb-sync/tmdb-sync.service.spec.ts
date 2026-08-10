import { ForbiddenException } from '@nestjs/common';
import { TmdbSyncService } from './tmdb-sync.service';

describe('TmdbSyncService.clearSyncedData', () => {

    const dataSource: any = {
        getMetadata: jest.fn((entity: any) => ({ tableName: entity.name })),
        getRepository: jest.fn(() => ({ count: jest.fn().mockResolvedValue(3) })),
        query: jest.fn().mockResolvedValue(undefined),
    };

    const buildService = (environment: string) => new TmdbSyncService(
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        dataSource,
        { get: () => environment } as any,
    );

    beforeEach(() => jest.clearAllMocks());

    it('truncates every table that holds synced or content-dependent rows', async () => {
        const { deletedRows } = await buildService('dev').clearSyncedData();

        const statement: string = dataSource.query.mock.calls[0][0];

        for (const table of [
            'ContentCreditEntity', 'MovieEntity', 'SeriesEntity',
            'ReviewEntity', 'WishlistEntity', 'FavoriteEntity',
            'ContentEntity', 'PersonEntity', 'GenreEntity',
        ]) {
            expect(statement).toContain(`"${table}"`);
            expect(deletedRows[table]).toBe(3);
        }

        expect(statement).toContain('RESTART IDENTITY CASCADE');
    });

    it('refuses to run in production', async () => {
        await expect(buildService('production').clearSyncedData()).rejects.toBeInstanceOf(ForbiddenException);

        expect(dataSource.query).not.toHaveBeenCalled();
    });
});
