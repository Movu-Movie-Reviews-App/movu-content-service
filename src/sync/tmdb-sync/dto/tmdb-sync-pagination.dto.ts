import { IsNumber, IsOptional, IsPositive, Max } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination-dto";

export class TmdbSyncPaginationDto extends PaginationDto {

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Max(process.env.MOVIES_MAX_TOTAL_FETCH_PAGES ? parseInt(process.env.MOVIES_MAX_TOTAL_FETCH_PAGES) : 50, { message: 'Total pages cannot exceed 50' })
    maxPages?: number;

}