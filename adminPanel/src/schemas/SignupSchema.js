import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { z } from "zod";

export const EmailSchema = z.object({
    email:z.string().email()
})


export const PasswordSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters') 
        .max(20, 'Password cannot be more than 20 characters') 
        .regex(/(?=.*[!@#$%^&*()_,.?":{}|<>])[A-Za-z\d!@#$%^&*()_,.?":{}|<>]{1,}$/, 'Password must contain at least one special character or underscore')
});