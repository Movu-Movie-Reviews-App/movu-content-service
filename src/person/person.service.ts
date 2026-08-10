import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonEntity } from './entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PersonService {

  constructor(
    @InjectRepository(PersonEntity)
    private readonly personRepository: Repository<PersonEntity>
  ) { }


  async createOrUpdate(createPersonDto: CreatePersonDto) {

    const existingPerson = await this.personRepository.findOneBy({ tmdbId: createPersonDto.tmdbId });

    if (existingPerson) {
      return await this.personRepository.save({ ...existingPerson, ...createPersonDto });
    }

    const person = this.personRepository.create(createPersonDto);
    await this.personRepository.save(person);


  }

  findAll() {
    return `This action returns all person`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
