import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';
import { GenresService } from './genres.service';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';
import { MessagePattern } from '@nestjs/microservices/decorators/message-pattern.decorator';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';

@Controller()
export class GenresController {
  constructor(private readonly genresService: GenresService) { }


  @MessagePattern('genres.findAllByContentType')
  findAllByContentType(@Payload('contentType', new ParseEnumPipe(ContentTypeEnum)) contentType: ContentTypeEnum) {

    if (!contentType) return this.genresService.findAll();

    return this.genresService.findAllByType(contentType);
  }


}
