import { z } from "zod";
import {
    baseNameSchema,
    emailSchema,
    passwordSchema,
    organizationSchema,
    validateEmail,
    validatePassword,
    validateName,
    NAME_MIN_LENGTH,
    NAME_MAX_LENGTH,
    ORGANIZATION_MIN_LENGTH,
    ORGANIZATION_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    NAME_REGEX,
    ORGANIZATION_REGEX,
} from "./common";

export const VALID_ROLES = ["farmer", "advisor", "contractor"] as const;
export type ValidRole = (typeof VALID_ROLES)[number];

const ROLES_REQUIRING_ORGANIZATION: ValidRole[] = ["advisor", "contractor"];

export const organizationSchemaOptional = organizationSchema.optional();

export const registerSchema = z
    .object({
        firstName: baseNameSchema,
        lastName: baseNameSchema,
        email: emailSchema,
        organization: organizationSchemaOptional,
        role: z.enum(VALID_ROLES, {
            errorMap: () => ({ message: "Please select a valid role" })
        }),
        password: passwordSchema,
        passwordConfirm: z.string().min(1, "Please confirm your password"),
        termsAccepted: z.boolean()
    })
    .refine(data => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"]
    })
    .refine(
        data => {
            if (ROLES_REQUIRING_ORGANIZATION.includes(data.role)) {
                return (
                    data.organization &&
                    data.organization.trim().length >= ORGANIZATION_MIN_LENGTH
                );
            }
            return true;
        },
        {
            message: "Organization name is required for advisor and contractor roles",
            path: ["organization"]
        }
    )
    .refine(data => data.termsAccepted === true, {
        message: "You must accept the terms and conditions",
        path: ["termsAccepted"]
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const registerDefaults: RegisterFormData = {
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "farmer",
    password: "",
    passwordConfirm: "",
    termsAccepted: false
};

export type ValidationError = {
    field: keyof RegisterFormData;
    message: string;
};

export const getFieldValidationRules = (field: keyof RegisterFormData) => {
    switch (field) {
        case "firstName":
        case "lastName":
            return {
                minLength: NAME_MIN_LENGTH,
                maxLength: NAME_MAX_LENGTH,
                pattern: NAME_REGEX,
                patternMessage: "Latin letters only (A–Z)"
            };
        case "email":
            return {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                patternMessage: "Please enter a valid email address"
            };
        case "password":
            return {
                minLength: PASSWORD_MIN_LENGTH,
                maxLength: PASSWORD_MAX_LENGTH
            };
        case "organization":
            return {
                minLength: ORGANIZATION_MIN_LENGTH,
                maxLength: ORGANIZATION_MAX_LENGTH,
                pattern: ORGANIZATION_REGEX,
                patternMessage: "Latin letters only (A–Z)"
            };
        
        default:
            return {};
    }
};

export { validateEmail, validatePassword, validateName };

export {
    baseNameSchema,
    emailSchema,
    passwordSchema,
    organizationSchema
} from "./common";
