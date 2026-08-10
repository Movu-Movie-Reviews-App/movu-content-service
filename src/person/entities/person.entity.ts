import { ContentCreditEntity } from "src/content/entities/content-credit";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PersonEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'int',
        unique: true
    })
    tmdbId: number;

    @Column({
        type: 'text',
    })
    name: string;

    @Column({
        type: 'text',
    })
    knownForDepartment: string;

    @Column({
        type: 'text',
        nullable: true
    })
    profilePath: string;

    @OneToMany(() => ContentCreditEntity, (contentCredit) => contentCredit.person)
    contentCredits: ContentCreditEntity[];

}
