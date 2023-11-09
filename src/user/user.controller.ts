import {
  Controller,
  Get,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { ProfileDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('profile')
  profile(@GetUser() user) {
    return user;
  }

  @Patch(':id')
  editUser(
    @GetUser('id') userId: number,
    @Req() dto: ProfileDto,
  ) {
    return this.userService.editProfile(
      userId,
      dto,
    );
  }
}
