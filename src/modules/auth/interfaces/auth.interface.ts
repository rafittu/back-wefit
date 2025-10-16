import { Request } from 'express';

export interface IUserPayload {
  id: string;
  name: string;
  email: string;
}

export interface IAuthRequest extends Request {
  user: IUserPayload;
}

export interface IJtwPayload {
  sub: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface IUserToken {
  accessToken: string;
}
