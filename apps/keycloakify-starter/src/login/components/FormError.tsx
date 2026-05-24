import React from "react";

interface FormErrorProps {
    message: string;
    className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, className = "" }) => {
    return (
        <span
            className={`form-error block mt-1 ml-1 text-xs font-medium text-red-600 opacity-80 leading-4 font-sans ${className}`}
            aria-live="polite"
        >
            {message}
        </span>
    );
};
