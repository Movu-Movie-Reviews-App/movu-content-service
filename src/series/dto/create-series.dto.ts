import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateSeriesDto {
    @IsUUID()
    id: string;

    @IsNumber()
    @IsPositive()
    numberOfSeasons: number;

    @IsNumber()
    @IsPositive()
    numberOfEpisodes: number;

}
