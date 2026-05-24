import { z } from "zod";
import { passwordSchema } from "./common";

export const updatePasswordSchema = z
    .object({
        password: passwordSchema,
        passwordConfirm: z.string().min(1, "Confirm password is required")
    })
    .refine(data => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"]
    });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export const updatePasswordFormDefaults: UpdatePasswordFormData = {
    password: "",
    passwordConfirm: ""
};
