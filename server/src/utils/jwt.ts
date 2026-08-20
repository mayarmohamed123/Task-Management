import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { IUserPayload } from '../types/index.js';

export const generateToken = (payload: IUserPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_SECRET as Secret, options);
};

export const verifyToken = (token: string): IUserPayload => {
  return jwt.verify(token, env.JWT_SECRET as Secret) as IUserPayload;
};
