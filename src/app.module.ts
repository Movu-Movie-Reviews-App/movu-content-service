import { Module } from '@nestjs/common';
import { envs } from './config';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ContentModule } from './content/content.module';
import { MovieModule } from './movie/movie.module';
import { SeriesModule } from './series/series.module';
import { PersonModule } from './person/person.module';
import { GenresModule } from './genres/genres.module';
import { TmdbSyncModule } from './sync/tmdb-sync/tmdb-sync.module';

@Module({

    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: envs.dbHost,
            port: envs.dbPort,
            username: envs.dbUsername,
            password: envs.dbPassword,
            database: envs.dbName,
            autoLoadEntities: true,
            synchronize: true,
        }),
        ContentModule,
        MovieModule,
        SeriesModule,
        PersonModule,
        GenresModule,
        TmdbSyncModule,
    ],


})
export class AppModule { }
