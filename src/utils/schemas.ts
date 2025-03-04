import * as z from 'zod';

export const userSchema = {
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().min(1, "Email is required").max(100).email("Invalid Email"),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character")
}


export const blogSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    image: z.string().url().optional(),
    // tags: z.array(z.string()).optional(),
    published: z.boolean().default(false).optional(),
});