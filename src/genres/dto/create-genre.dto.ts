import { IsEnum, IsNumber, IsPositive, IsString } from "class-validator";
import { ContentTypeEnum } from "src/common/enums/content-type.enum";


export class CreateGenreDto {

    @IsPositive()
    @IsNumber()
    tmdbId: number;

    @IsString()
    name: string;

    @IsEnum(ContentTypeEnum)
    contentType: ContentTypeEnum;

}
