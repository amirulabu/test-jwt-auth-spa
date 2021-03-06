import { REFRESH_TOKEN_COOKIE_NAME } from './constants';
import { UsersService } from './../users/users.service';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { TokensService } from './tokens.service';

const sevenDaysInSeconds = 60 * 60 * 24 * 7;
const sevenDaysInMiliseconds = 1000 * sevenDaysInSeconds;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ) {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);
    const valid = user
      ? await this.userService.validateCredentials(user, password)
      : false;

    if (!valid) {
      throw new UnauthorizedException('The login is invalid');
    }

    const accessToken = await this.tokensService.generateAccessToken(user);
    const refreshToken = await this.tokensService.generateRefreshToken(
      user,
      sevenDaysInSeconds,
    );

    response
      .cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        domain: 'localhost',
        expires: new Date(Date.now() + sevenDaysInMiliseconds),
      })
      .send({
        status: 'success',
        data: { token: accessToken },
      });
  }

  @Post('/refresh')
  public async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    const { token, user } =
      await this.tokensService.createAccessTokenFromRefreshToken(refreshToken);

    const newRefreshToken = await this.tokensService.generateRefreshToken(
      user,
      sevenDaysInSeconds,
    );

    response
      .cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
        httpOnly: true,
        domain: 'localhost',
        expires: new Date(Date.now() + sevenDaysInMiliseconds),
      })
      .send({
        status: 'success',
        data: { token },
      });
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie(REFRESH_TOKEN_COOKIE_NAME, '', { expires: new Date() });
  }
}
