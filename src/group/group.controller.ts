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

  @UseGuards(JwtAuthGuard, AdminsOnlyGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Request() req) {
    console.log(req);
    return this.groupService.getAllGroups();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.getGroupById(id);
  }

  @UseGuards(JwtAuthGuard, AdminsOnlyGuard)
  @Delete(':id')
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.deleteGroupById(id);
  }
}
