import jwt, { SignOptions } from "jsonwebtoken";
const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
export const generateAccessToken = (user: any, jti: string) => {
  const options: SignOptions = {
    expiresIn: ACCESS_EXPIRES_IN as unknown as number,
  };
  return jwt.sign(
    {
      sub: user.id,
      id: user.id,
      email: user.email,
      jti,
    },
    ACCESS_SECRET,
    options
  );
};

export const generateRefreshToken = (user: any, jti: string) => {
  const options: SignOptions = {
    expiresIn: REFRESH_EXPIRES_IN as unknown as number,
  };
  return jwt.sign(
    {
      sub: user.id,
      jti,
    },
    REFRESH_SECRET,
    options
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};
