export interface IResponseLogin {
  sub: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export interface AccessTokenJWT {
  sub: string;
  email: string;
  employeeId: string;
  iat: number;
  exp: number;
}