import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';
import { AdminsOnlyGuard } from 'src/user/guards/admins-only.guard';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto);
  }

  @UseGuards(JwtAuthGuard, AdminsOnlyGuard)
  @Get()
  getAll(@Request() req) {
    console.log(req);
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
