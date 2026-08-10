import { Controller, Param, ParseUUIDPipe } from '@nestjs/common';
import { MoviesService } from './movie.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }


  @MessagePattern('movies.findDetails')
  findMovieDetails(@Payload('id', ParseUUIDPipe) id: string) {
    return this.moviesService.findOne(id);
  }

}
