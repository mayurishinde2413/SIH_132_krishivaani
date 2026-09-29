import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { fail } from '../utils/apiResponse';
import prisma from '../database/prismaClient';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id: number; name: string; role: 'FARMER' | 'BUYER' };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(fail('Authentication required. Missing Bearer token.', 401));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json(fail('Token missing', 401));
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, phone: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json(fail('User account no longer exists', 401));
    }

    req.user = {
      userId: user.id,
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json(fail('Invalid or expired token', 401));
  }
};

export const authorize = (allowedRoles: ('FARMER' | 'BUYER')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json(fail('Access denied: Unauthorized role.', 403));
    }
    next();
  };
};
