import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { ProfileDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('profile')
  profile(@GetUser() user) {
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: ProfileDto,
  ) {
    return this.userService.editProfile(
      userId,
      dto,
    );
  }
}
