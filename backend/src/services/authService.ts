import prisma from '../database/prismaClient';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';

export interface RegisterFarmerInput {
  name: string;
  phone: string;
  email?: string;
  password: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  landHolding?: number;
  primaryCrop?: string;
}

export interface RegisterBuyerInput {
  companyName: string;
  contactPerson: string;
  businessType: string;
  phone: string;
  email?: string;
  gstNumber?: string;
  password: string;
  warehouseLocation: string;
  state: string;
  district: string;
}

export interface LoginInput {
  identifier: string; // phone or email
  password: string;
}

export const registerFarmer = async (input: RegisterFarmerInput) => {
  // Check if phone or email already registered
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: input.phone },
        ...(input.email ? [{ email: input.email }] : []),
      ],
    },
  });

  if (existingUser) {
    if (existingUser.phone === input.phone) {
      throw new Error('A user with this mobile number already exists');
    }
    if (input.email && existingUser.email === input.email) {
      throw new Error('A user with this email address already exists');
    }
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email ? input.email.toLowerCase() : null,
        passwordHash,
        role: 'FARMER',
        farmer: {
          create: {
            state: input.state,
            district: input.district,
            taluka: input.taluka,
            village: input.village,
            landHolding: input.landHolding ? Number(input.landHolding) : null,
            primaryCrop: input.primaryCrop || null,
          },
        },
      },
      include: {
        farmer: true,
      },
    });
    return user;
  });

  const token = signToken({
    userId: newUser.id,
    role: newUser.role,
    phone: newUser.phone,
    email: newUser.email,
  });

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
      farmer: newUser.farmer,
    },
    token,
  };
};

export const registerBuyer = async (input: RegisterBuyerInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: input.phone },
        ...(input.email ? [{ email: input.email }] : []),
      ],
    },
  });

  if (existingUser) {
    if (existingUser.phone === input.phone) {
      throw new Error('A user with this mobile number already exists');
    }
    if (input.email && existingUser.email === input.email) {
      throw new Error('A user with this email address already exists');
    }
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: input.contactPerson,
        phone: input.phone,
        email: input.email ? input.email.toLowerCase() : null,
        passwordHash,
        role: 'BUYER',
        buyer: {
          create: {
            companyName: input.companyName,
            contactPerson: input.contactPerson,
            businessType: input.businessType,
            gstNumber: input.gstNumber || null,
            warehouseLocation: input.warehouseLocation,
            state: input.state,
            district: input.district,
          },
        },
      },
      include: {
        buyer: true,
      },
    });
    return user;
  });

  const token = signToken({
    userId: newUser.id,
    role: newUser.role,
    phone: newUser.phone,
    email: newUser.email,
  });

  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
      buyer: newUser.buyer,
    },
    token,
  };
};

export const login = async (input: LoginInput) => {
  const identifier = input.identifier.trim();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: identifier },
        { email: identifier.toLowerCase() },
      ],
    },
    include: {
      farmer: true,
      buyer: true,
    },
  });

  if (!user) {
    throw new Error('Invalid mobile number/email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid mobile number/email or password');
  }

  const token = signToken({
    userId: user.id,
    role: user.role,
    phone: user.phone,
    email: user.email,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      farmer: user.farmer,
      buyer: user.buyer,
    },
    token,
  };
};

export const getUserProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
      createdAt: true,
      farmer: true,
      buyer: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
