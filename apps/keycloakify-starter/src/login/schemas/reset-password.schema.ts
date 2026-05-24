import { z } from "zod";
import { emailSchema, EMAIL_MAX_LENGTH } from "./common";

export const resetPasswordSchema = z.object({
    email: emailSchema
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const resetPasswordFormDefaults: ResetPasswordFormData = {
    email: ""
};

export const resetPasswordErrorMessages = {
    required: "Email is required",
    invalidFormat: "Please enter a valid email address format",
    invalidDomain: "Please enter a valid email domain",
    tooLong: "Email address exceeds maximum allowed length",
    disposable: "Disposable email addresses are not allowed",
    suspicious: "Please use a valid email address",
    emptyAfterSanitization: "Email cannot be empty after sanitization"
} as const;

export const getResetPasswordErrorMessage = (
    errorCode: keyof typeof resetPasswordErrorMessages
): string => {
    return resetPasswordErrorMessages[errorCode];
};

export interface ResetPasswordValidationResult {
    success: boolean;
    data?: ResetPasswordFormData;
    errors?: {
        email?: string[];
    };
}

export const validateResetPassword = (data: unknown): ResetPasswordValidationResult => {
    const result = resetPasswordSchema.safeParse(data);

    if (result.success) {
        return {
            success: true,
            data: result.data
        };
    }

    return {
        success: false,
        errors: result.error.flatten().fieldErrors
    };
};

export const RESET_PASSWORD_CONSTRAINTS = {
    MAX_ATTEMPTS_PER_HOUR: 5,
    MAX_ATTEMPTS_PER_DAY: 20,
    COOLDOWN_PERIOD_MS: 60000,
    EMAIL_MAX_LENGTH,
    EMAIL_MIN_LENGTH: 1
} as const;
