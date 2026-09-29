import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { ok, fail } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;

  if (!role || (role !== 'FARMER' && role !== 'BUYER')) {
    return res.status(400).json(fail('Valid role (FARMER or BUYER) is required', 400));
  }

  if (role === 'FARMER') {
    const {
      name,
      phone,
      email,
      password,
      confirmPassword,
      state,
      district,
      taluka,
      village,
      landHolding,
      primaryCrop,
    } = req.body;

    if (!name || !phone || !password || !state || !district || !taluka || !village) {
      return res
        .status(400)
        .json(
          fail(
            'Full Name, Mobile Number, Password, State, District, Taluka and Village are required fields.',
            400
          )
        );
    }

    if (password !== confirmPassword) {
      return res.status(400).json(fail('Password and Confirm Password do not match', 400));
    }

    if (password.length < 6) {
      return res.status(400).json(fail('Password must be at least 6 characters long', 400));
    }

    const result = await authService.registerFarmer({
      name,
      phone,
      email,
      password,
      state,
      district,
      taluka,
      village,
      landHolding,
      primaryCrop,
    });

    return res.status(201).json(ok(result, 'Farmer registered successfully'));
  }

  if (role === 'BUYER') {
    const {
      companyName,
      contactPerson,
      businessType,
      phone,
      email,
      gstNumber,
      password,
      confirmPassword,
      warehouseLocation,
      state,
      district,
    } = req.body;

    if (
      !companyName ||
      !contactPerson ||
      !businessType ||
      !phone ||
      !password ||
      !warehouseLocation ||
      !state ||
      !district
    ) {
      return res
        .status(400)
        .json(
          fail(
            'Business Name, Contact Person, Buyer Type, Mobile Number, Password, Primary Location, State and District are required.',
            400
          )
        );
    }

    if (password !== confirmPassword) {
      return res.status(400).json(fail('Password and Confirm Password do not match', 400));
    }

    if (password.length < 6) {
      return res.status(400).json(fail('Password must be at least 6 characters long', 400));
    }

    const result = await authService.registerBuyer({
      companyName,
      contactPerson,
      businessType,
      phone,
      email,
      gstNumber,
      password,
      warehouseLocation,
      state,
      district,
    });

    return res.status(201).json(ok(result, 'Buyer registered successfully'));
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json(fail('Mobile number/Email and password are required', 400));
  }

  const result = await authService.login({ identifier, password });
  return res.json(ok(result, 'Login successful'));
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Stateless JWT logout acknowledgment
  return res.json(ok(null, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(fail('Unauthorized', 401));
  }

  const profile = await authService.getUserProfile(req.user.id);
  return res.json(ok(profile));
});
