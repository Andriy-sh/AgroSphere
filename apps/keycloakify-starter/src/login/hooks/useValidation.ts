import { useState, useEffect } from "react";
import { z } from "zod";

interface UseValidationOptions {
    validateOnChange?: boolean;
    zodSchema?: z.ZodType<string> | z.ZodOptional<z.ZodType<string>>;
    customValidation?: (value: string) => string;
}

export function useValidation(value: string, options: UseValidationOptions = {}) {
    const { validateOnChange = false, zodSchema, customValidation } = options;
    const [localError, setLocalError] = useState<string>("");

    const validateField = (fieldValue: string): string => {
        if (zodSchema) {
            try {
                zodSchema.parse(fieldValue);
                return "";
            } catch (zodError) {
                if (zodError instanceof z.ZodError) {
                    return zodError.errors[0]?.message || "Invalid input";
                }
                return "Invalid input";
            }
        }

        if (customValidation) {
            return customValidation(fieldValue);
        }

        return "";
    };

    const handleChange = (newValue: string, onChange: (value: string) => void) => {
        onChange(newValue);

        if (validateOnChange) {
            const validationError = validateField(newValue);
            setLocalError(validationError);
        }
    };

    useEffect(() => {
        if (!validateOnChange) {
            setLocalError("");
        }
    }, [value, validateOnChange]);

    return {
        localError,
        setLocalError,
        validateField,
        handleChange
    };
}
