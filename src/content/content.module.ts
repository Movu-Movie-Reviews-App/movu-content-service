import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentEntity } from './entities/content.entity';
import { GenresModule } from 'src/genres/genres.module';
import { ContentFactoryService } from './content-factory.service';
import { ContentCreditEntity } from './entities/content-credit';

@Module({
  imports: [TypeOrmModule.forFeature([ContentEntity, ContentCreditEntity]), GenresModule],
  controllers: [ContentController],
  providers: [ContentService, ContentFactoryService],
  exports: [ContentFactoryService, ContentService]
})
export class ContentModule { }
