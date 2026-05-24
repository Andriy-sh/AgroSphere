import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { FormError } from "./FormError";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useValidation } from "../hooks/useValidation";
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "../schemas/common";

interface PasswordInputProps {
    id: string;
    name: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    kcClsx: KcClsx;
    style?: React.CSSProperties;
    className?: string;
    validateOnChange?: boolean;
    confirmPassword?: string;
    zodSchema?: z.ZodType<string> | z.ZodOptional<z.ZodType<string>>;
    showRequirements?: boolean;
}

export function PasswordInput({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    error,
    kcClsx,
    style,
    className,
    validateOnChange = false,
    confirmPassword,
    zodSchema
}: PasswordInputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const customValidation = (password: string): string => {
        if (password.length === 0) return "";

        if (confirmPassword !== undefined) {
            return "";
        }

        if (password.length < PASSWORD_MIN_LENGTH) {
            return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`;
        }

        if (password.length > PASSWORD_MAX_LENGTH) {
            return `Password must be no more than ${PASSWORD_MAX_LENGTH} characters long`;
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }

        if (!/\d/.test(password)) {
            return "Password must contain at least one number";
        }

        if (confirmPassword && password !== confirmPassword) {
            return "Passwords do not match";
        }

        return "";
    };

    const { localError, handleChange, setLocalError } = useValidation(value, {
        validateOnChange,
        zodSchema,
        customValidation
    });

    useEffect(() => {
        if (validateOnChange && confirmPassword && value) {
            const validationError = customValidation(value);
            setLocalError(validationError);
        }
    }, [confirmPassword, value, validateOnChange, setLocalError]);

    return (
        <>
            <label
                htmlFor={id}
                className={`${kcClsx("kcLabelClass")} text-xs font-normal text-gray-900 ${className || ""}`}
                style={style}
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder={placeholder}
                    className={`${kcClsx("kcInputClass")} pr-8`}
                    value={value}
                    onChange={e => handleChange(e.target.value, onChange)}
                />
                <button
                    type="button"
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    onClick={() => setIsPasswordVisible(v => !v)}
                    className={kcClsx("kcFormPasswordVisibilityButtonClass")}
                >
                    <span
                        className="material-symbols-outlined w-[18px] h-3 text-gray-500 text-xl"
                        aria-hidden
                    >
                        {isPasswordVisible ? "visibility_off" : "visibility"}
                    </span>
                </button>
            </div>
            {(error || localError) && (
                <FormError
                    message={error || localError}
                    className={kcClsx("kcInputErrorMessageClass")}
                />
            )}
        </>
    );
}
