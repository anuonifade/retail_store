import {
  Strategy,
  ExtractJwt,
} from 'passport-jwt';
import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookies,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  private static extractJWTFromCookies(
    @Req() req,
  ): string | null {
    if (req.cookies || req.headers?.cookie) {
      const access_token_cookie =
        req.cookies || req.headers?.cookie;

      if (
        typeof access_token_cookie == 'string'
      ) {
        return JwtStrategy.extractAccessTokenFromString(
          access_token_cookie,
        );
      }

      return access_token_cookie.access_token;
    }
    return null;
  }

  private static extractAccessTokenFromString(
    cookie: string,
  ) {
    return cookie.split(';')[0].split('=')[1];
  }

  async validate(payload: {
    sub: number;
    email: string;
  }) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });

    delete user.hash;
    return user;
  }
}
