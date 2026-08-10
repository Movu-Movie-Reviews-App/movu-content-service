import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { SeriesService } from './series.service';
import { MessagePattern } from '@nestjs/microservices/decorators/message-pattern.decorator';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) { }


  @MessagePattern('series.findDetails')
  findSeriesDetails(@Payload('id', ParseUUIDPipe) id: string) {
    return this.seriesService.findOne(id);
  }

}
