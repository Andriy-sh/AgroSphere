import { z } from "zod";
import { emailSchema, passwordSchema } from "./common";

export const loginSchema = z.object({
    username: emailSchema,
    password: passwordSchema,
    rememberMe: z.boolean().optional()
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginFormDefaults: LoginFormData = {
    username: "",
    password: "",
    rememberMe: false
};
