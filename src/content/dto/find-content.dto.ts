import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { ContentSortEnum } from "../enums/content-sort.enum";
import { ContentTypeEnum } from "src/common/enums/content-type.enum";
import { PaginationDto } from "src/common/dto/pagination-dto";

export class FindContentDto extends PaginationDto {

    @IsOptional()
    @IsEnum(ContentTypeEnum)
    contentType?: ContentTypeEnum;

    @IsOptional()
    @IsEnum(ContentSortEnum)
    sortBy?: ContentSortEnum;

    @IsOptional()
    @IsString()
    genreSlug?: string = 'all';

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    search?: string;


}