import { OmitType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { FindContentDto } from "./find-content.dto";

// Same filters as FindContentDto, but the term is what the endpoint is for,
// so it is required here instead of optional.
export class SearchContentDto extends OmitType(FindContentDto, ['search'] as const) {

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim())
    search: string;

}
