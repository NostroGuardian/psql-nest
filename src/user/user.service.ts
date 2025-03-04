import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import {
  USER_ALREADY_EXIST_ERROR,
  USER_NOT_FOUND_EMAIL_ERROR,
  USER_NOT_FOUND_ERROR,
  USER_WRONG_PASSWORD_ERROR,
} from './user.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly groupService: GroupService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const defaultGroupId = 1;
    const group = await this.groupService.getGroupById(defaultGroupId);
    const oldUser = await this.getUserByEmail(createUserDto.email);
    if (oldUser) {
      throw new BadRequestException(USER_ALREADY_EXIST_ERROR);
    }
    const salt = await genSalt(10);
    const newUser = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      group: group,
      passwordHash: await hash(createUserDto.password, salt),
    });
    return this.userRepository.save(newUser);
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.getUserByEmail(loginUserDto.email);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_EMAIL_ERROR);
    }
    const isCorrectPassword = await compare(
      loginUserDto.password,
      user.passwordHash,
    );
    if (!isCorrectPassword) {
      throw new UnauthorizedException(USER_WRONG_PASSWORD_ERROR);
    }
    return { name: user.name, email: user.email, role: user.group.alias };
  }

  async loginUser(name: string, email: string, role: string) {
    const payload = { name, email, role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ['group'] });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['group'],
    });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['group'],
    });
  }

  async updateUserById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const toBeUpdatedUser = await this.getUserById(id);
    if (!toBeUpdatedUser) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
    await this.userRepository.update(id, updateUserDto);
    return toBeUpdatedUser;
  }

  async deleteUserById(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(USER_NOT_FOUND_ERROR);
    }
  }
}
