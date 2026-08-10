import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
} from "class-validator";
import { ContentTypeEnum } from "src/common/enums/content-type.enum";
import { CreateContentCreditDto } from "./create-content-credit.dto";

export class CreateContentDto {

    @IsNumber()
    @IsPositive()
    tmdbId: number;

    @IsString()
    title: string;

    @IsString()
    overview: string;

    @IsDate()
    @Type(() => Date)
    releaseDate: Date;

    @IsString()
    posterPath: string;

    @IsString()
    backdropPath: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    popularity?: number;

    @IsArray()
    @IsNumber({}, { each: true })
    @IsPositive({ each: true })
    genreIds?: number[];

    @IsOptional()
    @IsBoolean()
    adult?: boolean;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    runtime?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfSeasons?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    numberOfEpisodes?: number;

    @IsOptional()
    @IsEnum(ContentTypeEnum)
    type?: ContentTypeEnum;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateContentCreditDto)
    credits?: CreateContentCreditDto[];

}