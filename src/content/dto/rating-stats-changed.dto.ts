import { IsInt, IsNumber, IsUUID, Max, Min } from "class-validator";

export class RatingStatsChangedDto {

    @IsUUID()
    contentId: string;

    @IsNumber()
    @Min(0)
    @Max(5)
    averageRating: number;

    @IsInt()
    @Min(0)
    reviewsCount: number;
}
