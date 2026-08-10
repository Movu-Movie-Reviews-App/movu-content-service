import { IsNumber, IsOptional, IsPositive, Max, Min } from "class-validator";

export class PaginationDto {


    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Min(1)
    @Max(100)
    limit?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    page?: number;

}