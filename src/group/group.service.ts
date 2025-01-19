import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  GROUP_ALREADY_EXIST_ERROR,
  GROUP_NOT_FOUND_ERROR,
} from './group.constants';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    const oldGroup = await this.groupRepository.findOneBy({
      alias: createGroupDto.alias,
    });
    if (oldGroup) {
      throw new BadRequestException(GROUP_ALREADY_EXIST_ERROR);
    }
    return await this.groupRepository.save(createGroupDto);
  }

  async getAllGroups(): Promise<Group[]> {
    return await this.groupRepository.find();
  }

  async getGroupById(id: number): Promise<Group> {
    const group = await this.groupRepository.findOneBy({ id });
    if (!group) {
      throw new NotFoundException(GROUP_NOT_FOUND_ERROR);
    }
    return group;
  }

  async deleteGroupById(id: number): Promise<void> {
    const result = await this.groupRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(GROUP_NOT_FOUND_ERROR);
    }
  }
}
