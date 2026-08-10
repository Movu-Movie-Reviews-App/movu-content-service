import { Type } from "class-transformer";
import {
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { CreatePersonDto } from "src/person/dto/create-person.dto";

export class CreateContentCreditDto {

    @IsOptional()
    @IsString()
    character?: string;

    @ValidateNested()
    @Type(() => CreatePersonDto)
    person: CreatePersonDto;
}