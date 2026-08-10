import { IsNumber, IsPositive, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto {
    @IsUUID()
    id: string;

    @IsNumber()
    @IsPositive()
    runtime: number;


}
