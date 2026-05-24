import React from "react";

interface RadioOption {
    value: string;
    label: string;
}

interface RadioInputProps {
    name: string;
    options?: RadioOption[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    error?: string;
    className?: string;
    layout?: "single-column" | "two-columns";
}

export const RadioInput: React.FC<RadioInputProps> = ({
    name,
    options = [],
    value,
    onChange,
    label,
    error,
    className = "",
    layout = "single-column"
}) => {
    return (
        <div className={className}>
            {label && (
                <div className="text-sm font-medium text-gray-900 mb-3 ">{label}</div>
            )}

            <div
                className={`flex gap-6 ${layout === "two-columns" ? "flex-wrap" : "flex-col"}`}
            >
                {options?.map(option => {
                    const isChecked = value === option.value;

                    return (
                        <label
                            key={option.value}
                            className={`!flex !flex-row items-center gap-2 cursor-pointer ${
                                layout === "two-columns" ? "w-[calc(50%-12px)]" : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={isChecked}
                                onChange={e => onChange(e.target.value)}
                                className="sr-only"
                            />
                            <span
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                                    isChecked ? "border-green-600" : "border-gray-300"
                                }`}
                            >
                                {isChecked && (
                                    <span className="w-3 h-3 bg-green-600 rounded-full" />
                                )}
                            </span>
                            <span className="text-sm text-[#101010] font-normal">
                                {option.label}
                            </span>
                        </label>
                    );
                })}
            </div>

            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
    );
};
