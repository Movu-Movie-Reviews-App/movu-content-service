import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, Index } from "typeorm";
import { ContentEntity } from "../../content/entities/content.entity";

@Index(['tmdbId', 'contentType'], { unique: true })
@Index(['slug', 'contentType'], { unique: true })
@Entity()
export class GenreEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
    })
    tmdbId: number;

    @Column({
        type: 'enum',
        enum: ['movie', 'series'],
        default: 'movie'
    })
    contentType: string;

    @Column({
        type: 'text',
    })
    name: string;

    @Column({
        type: 'text',
    })
    slug: string;

    @ManyToMany(() => ContentEntity, (content) => content.genres)
    contents: ContentEntity[];

}
