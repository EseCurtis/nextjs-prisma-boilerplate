import { UserRole } from "@prisma/client";
import { z } from "zod";

// Authentication & User Management

//user register schema
export const registerUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password should have at least 8 characters"),
    //role: z.enum(Object.values(UserRole) as [UserRole])
});


// Login schema
export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password should have at least 8 characters"),
});


// refresh token schema
export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(20, "Invalid refresh token format"),
});


// request confirmation schema
export const requestConfirmationSchema = z.object({
    email: z.string().email("Invalid email format"),
});

// Confirm account schema
export const confirmAccountSchema = z.object({
    email: z.string().email("Invalid email format"),
    otp: z.number().min(8, "Password should have at least 8 characters"),
});

// Role assignment schema
export const assignRoleSchema = z.object({
    userId: z.string().uuid("Invalid user ID format"),
    role: z.enum(Object.values(UserRole) as [UserRole])
});



// Update user schema
export const updateUserSchema = z.object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "First name is required").optional(),
    role: z.enum(Object.values(UserRole) as [UserRole]).optional()
});

// Update user schema
export const updateProfileSchema = z.object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
});



export const basePaginationSchema = z.object({
    page: z.number().min(1, "page is required").default(1), // Page number (defaults to 1)
    limit: z.number().min(1, "limit is required").max(100).default(10), // Limit number of items per page (defaults to 10)
})

export const userListSchema = z.object({
    role: z.enum(Object.values(UserRole) as [UserRole])
})

export const emailCheckSchema = z.object({
    email: z.string().email("Invalid email format"),
})