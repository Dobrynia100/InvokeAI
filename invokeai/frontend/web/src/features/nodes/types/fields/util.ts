import { z } from 'zod';

export const zInt = z.number().int();
export const zIntOptional = z.number().int().optional();
export const zFloat = z.number();
export const zFloatOptional = z.number().optional();
export const zString = z.string();
export const zStringOptional = z.string().optional();
export const zBoolean = z.boolean();
export const zBooleanOptional = z.boolean().optional();
