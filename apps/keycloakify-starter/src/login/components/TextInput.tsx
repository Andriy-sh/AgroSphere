import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { FormError } from "./FormError";
import { FormLabel } from "./FormLabel";
import { z } from "zod";
import { useValidation } from "../hooks/useValidation";
import { EMAIL_REGEX } from "../schemas/common";

interface TextInputProps {
    id: string;
    name: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    kcClsx: KcClsx;
    type?: string;
    required?: boolean;
    style?: React.CSSProperties;
    validateOnChange?: boolean;
    minLength?: number;
    zodSchema?: z.ZodType<string> | z.ZodOptional<z.ZodType<string>>;
    readonly?: boolean;
}

export function TextInput({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    error,
    kcClsx,
    type = "text",
    required = true,
    style,
    validateOnChange = false,
    minLength = 2,
    zodSchema,
    readonly
}: TextInputProps) {
    const customValidation = (fieldValue: string): string => {
        if (fieldValue.length === 0) return "";

        if (type === "email") {
            if (fieldValue.includes(" ")) {
                return "Email address cannot contain spaces";
            }

            if (!fieldValue.includes("@")) {
                return "Please enter an email in the format user@domain.com";
            }

            const parts = fieldValue.split("@");
            if (parts.length !== 2 || parts[1].length === 0) {
                return "Check the domain — after @, there should be a site name";
            }

            const domain = parts[1];
            if (!domain.includes(".") || domain.split(".")[1]?.length === 0) {
                return "Domain must include a valid extension (e.g., .com, .org)";
            }

            if (!EMAIL_REGEX.test(fieldValue)) {
                return "Please enter a valid email address";
            }
        }

        if (minLength && fieldValue.length < minLength) {
            return `${label} must be at least ${minLength} characters`;
        }

        return "";
    };

    const { localError, handleChange } = useValidation(value, {
        validateOnChange,
        zodSchema,
        customValidation
    });

    return (
        <>
            <FormLabel htmlFor={id} kcClsx={kcClsx} required={required} style={style}>
                {label}
            </FormLabel>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                className={`${kcClsx("kcInputClass")} ${readonly ? "bg-[#EEF0F6] cursor-not-allowed" : ""}`}
                value={value}
                onChange={e => handleChange(e.target.value, onChange)}
                readOnly={readonly}
            />
            {(error || localError) && (
                <FormError
                    message={error || localError}
                    className={kcClsx("kcInputErrorMessageClass")}
                />
            )}
        </>
    );
}
