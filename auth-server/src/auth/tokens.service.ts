import { UnprocessableEntityException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { User } from '../generated/nestjs-dto/user.entity';

import { UsersService } from './../users/users.service';
import { BASE_OPTIONS } from './constants';

export interface RefreshTokenPayload {
  version: number;
  sub: number;
}

@Injectable()
export class TokensService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  public async generateAccessToken(user: User): Promise<string> {
    const opts: JwtSignOptions = {
      ...BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: '15m',
    };

    return this.jwt.signAsync({}, opts);
  }

  public async generateRefreshToken(
    user: User,
    expiresIn: number,
  ): Promise<string> {
    const opts: JwtSignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(user.id),
    };

    return this.jwt.signAsync(
      {
        version: String(user.tokenVersion),
      },
      opts,
    );
  }

  public async resolveRefreshToken(encodedRefreshToken: string): Promise<User> {
    const payload = await this.decodeRefreshToken(encodedRefreshToken);
    const user = await this.getUserFromRefreshTokenPayload(payload);

    if (!user) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    if (user.tokenVersion !== Number(payload.version)) {
      throw new UnprocessableEntityException('Refresh token version expired');
    }

    return user;
  }

  public async createAccessTokenFromRefreshToken(
    refresh: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.resolveRefreshToken(refresh);

    const token = await this.generateAccessToken(user);

    return { token, user };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      const x = await this.jwt.verifyAsync(token);
      return x;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<User> {
    const subId = Number(payload.sub);

    if (!subId) {
      throw new UnprocessableEntityException('Refresh token malformed');
    }

    return this.users.user(subId);
  }
}
