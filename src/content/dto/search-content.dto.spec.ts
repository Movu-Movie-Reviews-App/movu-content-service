import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { SearchContentDto } from './search-content.dto';

describe('SearchContentDto', () => {

    // Mirrors the global ValidationPipe options set in main.ts.
    const buildDto = (query: Record<string, unknown>) =>
        plainToInstance(SearchContentDto, query, { enableImplicitConversion: true });

    const failedProperties = (query: Record<string, unknown>) =>
        validateSync(buildDto(query)).map((error) => error.property);

    it('requires a search term', () => {
        expect(failedProperties({})).toContain('search');
    });

    it('rejects a term that is only whitespace', () => {
        expect(failedProperties({ search: '   ' })).toContain('search');
    });

    it('trims the term and accepts the remaining filters', () => {
        const query = { search: '  matrix  ', contentType: 'movie', page: '2', limit: '10' };

        expect(validateSync(buildDto(query))).toHaveLength(0);
        expect(buildDto(query).search).toBe('matrix');
    });

    it('still validates the filters inherited from FindContentDto', () => {
        expect(failedProperties({ search: 'matrix', contentType: 'podcast' })).toContain('contentType');
    });
});
