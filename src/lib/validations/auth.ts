import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Email invalid"),
  password: z.string().min(6, "Parola trebuie să aibă cel puțin 6 caractere"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere"),
  email: z.email("Email invalid"),
  phone: z.string().optional(),
  password: z.string().min(6, "Parola trebuie să aibă cel puțin 6 caractere"),
  confirmPassword: z.string(),
}).check(
  (data) => data.password === data.confirmPassword,
  {
    message: "Parolele nu se potrivesc",
    path: ["confirmPassword"],
  }
);

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
