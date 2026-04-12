import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto'
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders, RoleProtected, Auth } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ){
    
    return {
      ok: true,
      message: 'Hola mundo',
      user,
      userEmail,
      rawHeaders
    }
  }



  //@SetMetadata('roles',['admin','super-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.admin, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testPrivateRoute2(
    @GetUser() user: User
  ){
    
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  testPrivateRoute3(
    @GetUser() user: User
  ){
    
    return {
      ok: true,
      user
    }
  }

}
