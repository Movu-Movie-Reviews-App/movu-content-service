import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseEnumPipe, ParseUUIDPipe } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentTypeEnum } from 'src/common/enums/content-type.enum';
import { FindContentDto } from './dto/find-content.dto';
import { SearchContentDto } from './dto/search-content.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) { }

  @MessagePattern('content.create')
  create(@Payload() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @MessagePattern('content.findAll')
  findAll(@Payload() query: FindContentDto) {
    return this.contentService.findAll(query);
  }

  @MessagePattern('content.search')
  search(@Payload() query: SearchContentDto) {
    return this.contentService.findAll(query);
  }

  @MessagePattern('content.findTopRatedOfTheWeek')
  findTopRatedOfTheWeek(@Payload() query: FindContentDto) {
    return this.contentService.findTopRatedOfTheWeek(query);
  }

  @MessagePattern('content.findOne')
  findOne(@Payload('contentId', ParseUUIDPipe) contentId: string) {

    return this.contentService.findOne(contentId)
  }

  @MessagePattern('content.findByGenre')
  getContentByGenre(@Payload('contentType', new ParseEnumPipe(ContentTypeEnum)) contentType: ContentTypeEnum) {
    return this.contentService.getContentByGenre(contentType);
  }
}