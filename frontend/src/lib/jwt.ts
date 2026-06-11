import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'edugenie-super-secret-development-key';
const key = new TextEncoder().encode(secretKey);

export async function signToken(payload: any, expiresIn: string | number = '1d') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn as string | number)
    .sign(key);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}
