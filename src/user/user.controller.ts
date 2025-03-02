import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAccessGuard } from 'src/auth/guard/jwt.access.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('fetchAll')
  @UseGuards(JwtAccessGuard)  
  findAll() {
    return this.userService.findAll();
  }

}
