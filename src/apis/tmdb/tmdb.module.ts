import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [],
  providers: [TmdbService],
  exports: [TmdbService],
  imports: [CommonModule],
})
export class TmdbModule { }
