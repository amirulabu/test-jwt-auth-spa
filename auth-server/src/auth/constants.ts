import { JwtSignOptions } from '@nestjs/jwt';

export const REFRESH_TOKEN_COOKIE_NAME = 'jid';

export const BASE_OPTIONS: JwtSignOptions = {
  issuer: 'https://my-app.com',
  audience: 'https://my-app.com',
};
