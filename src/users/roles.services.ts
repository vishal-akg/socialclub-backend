import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindRole } from './dtos/find-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly repository: Repository<Role>,
  ) {}

  async find(params: Partial<FindRole>) {
    return this.repository.findBy({ ...params });
  }
}
