import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto);
  }

  @Get()
  getAll() {
    return this.groupService.getAllGroups();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.getGroupById(id);
  }

  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.deleteGroupById(id);
  }
}
