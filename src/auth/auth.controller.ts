import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    this.authService.signup(dto);

    return dto;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() dto: SignInDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } =
      await this.authService.signin(dto);

    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(
          Date.now() + 1 * 24 * 60 * 1000,
        ),
      })
      .send({ access_token });
  }

  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res
      .clearCookie('access_token', {
        httpOnly: null,
        secure: false,
        sameSite: 'lax',
      })
      .send({
        status: 'Logged out successfully',
      });
  }
}
