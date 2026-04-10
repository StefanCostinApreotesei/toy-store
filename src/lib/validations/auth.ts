import { z } from "zod/v4";

const passwordSchema = z.string()
  .min(8, "Parola trebuie să aibă cel puțin 8 caractere")
  .max(128, "Parola nu poate depăși 128 de caractere")
  .regex(/[A-Z]/, "Parola trebuie să conțină cel puțin o literă mare")
  .regex(/[a-z]/, "Parola trebuie să conțină cel puțin o literă mică")
  .regex(/[0-9]/, "Parola trebuie să conțină cel puțin o cifră");

export const loginSchema = z.object({
  email: z.email("Email invalid"),
  password: z.string().min(1, "Parola este obligatorie"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă cel puțin 2 caractere").max(100, "Numele nu poate depăși 100 de caractere"),
  email: z.email("Email invalid"),
  phone: z.string().max(20, "Număr de telefon prea lung").optional(),
  password: passwordSchema,
  confirmPassword: z.string(),
}).check(
  (payload) => {
    if (payload.value.password !== payload.value.confirmPassword) {
      payload.issues.push({
        code: "custom",
        input: payload.value.confirmPassword,
        message: "Parolele nu se potrivesc",
        path: ["confirmPassword"],
      });
    }
  }
);

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
