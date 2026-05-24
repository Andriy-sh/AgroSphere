import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 50;
export const ORGANIZATION_MIN_LENGTH = 2;
export const ORGANIZATION_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 254;
export const COMPANY_NO_MIN_LENGTH = 1;
export const COMPANY_NO_MAX_LENGTH = 20;

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const NAME_REGEX = /^[a-zA-Z\s\-']+$/;
export const ORGANIZATION_REGEX = /^[a-zA-Z0-9\s\-'.]+$/;
export const COMPANY_NO_REGEX = /^[0-9]+$/;

export const DISPOSABLE_EMAIL_DOMAINS = [
    "10minutemail.com",
    "tempmail.org",
    "guerrillamail.com",
    "mailinator.com",
    "yopmail.com",
    "throwaway.email",
    "temp-mail.org"
] as const;

export const SUSPICIOUS_EMAIL_PATTERNS = [
    /test@test\.com$/i,
    /admin@admin\.com$/i,
    /user@example\.com$/i,
    /demo@demo\.com$/i
] as const;

export const baseNameSchema = z
    .string()
    .trim()
    .min(1, "This field is required")
    .min(NAME_MIN_LENGTH, `Must be at least ${NAME_MIN_LENGTH} characters`)
    .max(NAME_MAX_LENGTH, `Must be no more than ${NAME_MAX_LENGTH} characters`)
    .regex(NAME_REGEX, "Latin letters only (A–Z)");

export const emailSchema = z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(EMAIL_MAX_LENGTH, "Email address is too long")
    .refine((email: string) => !email.includes(" "), {
        message: "Email address cannot contain spaces"
    })
    .refine((email: string) => email.includes("@"), {
        message: "Please enter an email in the format user@domain.com"
    })
    .refine(
        (email: string) => {
            const parts = email.split("@");
            return parts.length === 2 && parts[1].length > 0;
        },
        {
            message: "Check the domain — after @, there should be a site name"
        }
    )
    .refine(
        (email: string) => {
            const domain = email.split("@")[1];
            return domain && domain.includes(".") && domain.split(".")[1]?.length > 0;
        },
        {
            message: "Domain must include a valid extension (e.g., .com, .org)"
        }
    )
    .refine((email: string) => EMAIL_REGEX.test(email), {
        message: "Please enter a valid email address"
    })
    .transform((email: string) => email.toLowerCase())
    .refine(
        (email: string) => {
            const domain = email.split("@")[1];
            return domain
                ? !DISPOSABLE_EMAIL_DOMAINS.includes(
                      domain as (typeof DISPOSABLE_EMAIL_DOMAINS)[number]
                  )
                : true;
        },
        {
            message: "Disposable email addresses are not allowed"
        }
    )
    .refine(
        (email: string) => {
            return !SUSPICIOUS_EMAIL_PATTERNS.some(pattern => pattern.test(email));
        },
        {
            message: "Please use a valid email address"
        }
    );

export const passwordSchema = z
    .string()
    .min(1, "Password is required")
    .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
    )
    .max(
        PASSWORD_MAX_LENGTH,
        `Password must be no more than ${PASSWORD_MAX_LENGTH} characters`
    )
    .refine((password: string) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter"
    })
    .refine((password: string) => /\d/.test(password), {
        message: "Password must contain at least one number"
    });

export const organizationSchema = z
    .string()
    .trim()
    .min(
        ORGANIZATION_MIN_LENGTH,
        `Must be at least ${ORGANIZATION_MIN_LENGTH} characters`
    )
    .max(
        ORGANIZATION_MAX_LENGTH,
        `Organization name must be no more than ${ORGANIZATION_MAX_LENGTH} characters`
    )
    .regex(ORGANIZATION_REGEX, "Latin letters only (A–Z)");

// export const companyNoSchema = z
//     .string()
//     .trim()
//     .min(COMPANY_NO_MIN_LENGTH, "Company number is required")
//     .max(
//         COMPANY_NO_MAX_LENGTH,
//         `Company number must be no more than ${COMPANY_NO_MAX_LENGTH} characters`
//     )
//     .regex(COMPANY_NO_REGEX, "Only numbers are allowed");

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
    if (email.length === 0) {
        return { isValid: false, error: "Email is required" };
    }

    if (email.includes(" ")) {
        return { isValid: false, error: "Email address cannot contain spaces" };
    }

    if (!email.includes("@")) {
        return {
            isValid: false,
            error: "Please enter an email in the format user@domain.com"
        };
    }

    const parts = email.split("@");
    if (parts.length !== 2 || parts[1].length === 0) {
        return {
            isValid: false,
            error: "Check the domain — after @, there should be a site name"
        };
    }

    const domain = parts[1];
    if (!domain.includes(".") || domain.split(".")[1]?.length === 0) {
        return {
            isValid: false,
            error: "Domain must include a valid extension (e.g., .com, .org)"
        };
    }

    if (!EMAIL_REGEX.test(email)) {
        return { isValid: false, error: "Please enter a valid email address" };
    }

    return { isValid: true };
};

export const validatePassword = (
    password: string
): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < PASSWORD_MIN_LENGTH) {
        errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
    }

    if (password.length > PASSWORD_MAX_LENGTH) {
        errors.push(`Password must be no more than ${PASSWORD_MAX_LENGTH} characters`);
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }

    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateName = (name: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (name.length < NAME_MIN_LENGTH) {
        errors.push(`Must be at least ${NAME_MIN_LENGTH} characters`);
    }

    if (name.length > NAME_MAX_LENGTH) {
        errors.push(`Name must be no more than ${NAME_MAX_LENGTH} characters`);
    }

    if (!NAME_REGEX.test(name)) {
        errors.push("Latin letters only (A–Z)");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// export const validateCompanyNo = (
//     companyNo: string
// ): { isValid: boolean; errors: string[] } => {
//     const errors: string[] = [];

//     if (companyNo.length < COMPANY_NO_MIN_LENGTH) {
//         errors.push("Company number is required");
//     }

//     if (companyNo.length > COMPANY_NO_MAX_LENGTH) {
//         errors.push(
//             `Company number must be no more than ${COMPANY_NO_MAX_LENGTH} characters`
//         );
//     }

//     if (!COMPANY_NO_REGEX.test(companyNo)) {
//         errors.push("Only numbers are allowed");
//     }

//     return {
//         isValid: errors.length === 0,
//         errors
//     };
// };
