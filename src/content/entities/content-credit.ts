import { PersonEntity } from "src/person/entities/person.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ContentEntity } from "./content.entity";

@Entity()
export class ContentCreditEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    // For cast members
    @Column({
        type: 'text',
    })
    character?: string;

    @ManyToOne(() => PersonEntity, (person) => person.contentCredits)
    person: PersonEntity;

    @ManyToOne(() => ContentEntity, (content) => content.contentCredits)
    content: ContentEntity;

}