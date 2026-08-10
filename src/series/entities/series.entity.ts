import { ContentEntity } from "src/content/entities/content.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SeriesEntity {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
        default: 0
    })
    numberOfSeasons: number;

    @Column({
        type: 'int',
        default: 0
    })
    numberOfEpisodes: number;

    @OneToOne(() => ContentEntity, { cascade: true })
    @JoinColumn({ name: 'id' })
    content: ContentEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
