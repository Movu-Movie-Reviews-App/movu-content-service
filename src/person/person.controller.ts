import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { MessagePattern } from '@nestjs/microservices/decorators/message-pattern.decorator';
import { Payload } from '@nestjs/microservices/decorators/payload.decorator';

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) { }

  @MessagePattern('persons.create')
  create(@Payload() createPersonDto: CreatePersonDto) {
    return this.personService.createOrUpdate(createPersonDto);
  }

  @MessagePattern('persons.findAll')
  findAll() {
    return this.personService.findAll();
  }

  @MessagePattern('persons.findOne')
  findOne(@Payload('id') id: string) {
    return this.personService.findOne(+id);
  }

  @MessagePattern('persons.update')
  update(@Payload('id') id: string, @Payload() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @MessagePattern('persons.remove')
  remove(@Payload('id') id: string) {
    return this.personService.remove(+id);
  }
}
