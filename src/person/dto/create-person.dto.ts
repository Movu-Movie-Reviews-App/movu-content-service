import {
    IsNumber,
    IsPositive,
    IsString,
} from "class-validator";

export class CreatePersonDto {

    @IsNumber()
    @IsPositive()
    tmdbId: number;

    @IsString()
    name: string;

    @IsString()
    knownForDepartment: string;

    @IsString()
    profilePath?: string;

}