import React, { useRef, useEffect } from "react";

interface OTPInputProps {
    value: string[];
    onChange: (val: string[]) => void;
    onValidate?: (code: string) => boolean;
    error?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    timer?: number;
    onResendCode?: () => void;
    isCodeIncorrect?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
    value,
    onChange,
    error,
    disabled,
    autoFocus,
    timer,
    onResendCode,
    isCodeIncorrect
}) => {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (autoFocus && inputsRef.current[0]) {
            inputsRef.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = (idx: number, val: string) => {
        if (!/^[0-9]?$/.test(val)) return;
        const next = [...value];
        next[idx] = val;
        onChange(next);
        if (val && idx < value.length - 1) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (idx === 0) {
                const lastIdx = [...value]
                    .slice(1)
                    .reverse()
                    .findIndex(v => v !== "");
                if (lastIdx !== -1) {
                    const realIdx = value.length - 1 - lastIdx;
                    const next = [...value];
                    next[realIdx] = "";
                    onChange(next);
                    inputsRef.current[realIdx]?.focus();
                } else {
                    if (value[0] !== "") {
                        const next = [...value];
                        next[0] = "";
                        onChange(next);
                        inputsRef.current[0]?.focus();
                    }
                }
                e.preventDefault();
                return;
            }
            if (!value[idx] && idx > 0) {
                onChange(value.map((v, i) => (i === idx - 1 ? "" : v)));
                inputsRef.current[idx - 1]?.focus();
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex gap-4 mb-4 w-full justify-center">
                {value.map((v, idx) => (
                    <input
                        key={idx}
                        ref={el => {
                            inputsRef.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className={`w-20 h-9 rounded-lg border text-center text-2xl font-semibold text-gray-900 bg-white outline-none transition-all border-[#E5E7EB] focus:border-[#29B54C] ${error ? "border-red-400" : ""}`}
                        value={v}
                        placeholder="-"
                        onChange={e => handleChange(idx, e.target.value)}
                        onKeyDown={e => handleKeyDown(idx, e)}
                        disabled={disabled}
                        autoFocus={autoFocus && idx === 0}
                    />
                ))}
            </div>
            {error && (
                <div className="text-center text-red-500 text-sm font-medium mb-2">
                    {error}
                </div>
            )}
            <div className="text-center mb-4">
                {timer !== undefined && timer > 0 && !isCodeIncorrect && (
                    <div className="text-red-500 text-sm font-medium">
                        {`00:${timer.toString().padStart(2, "0")}`}
                    </div>
                )}
                {timer !== undefined &&
                    timer === 0 &&
                    !isCodeIncorrect &&
                    onResendCode && (
                        <button
                            type="button"
                            onClick={onResendCode}
                            className="text-[#29B54C] text-sm font-medium hover:underline cursor-pointer"
                        >
                            Resend code
                        </button>
                    )}
                {isCodeIncorrect && (
                    <>
                        <div className="text-red-500 text-sm font-medium mb-2">
                            The verification code you entered is incorrect. Request a new
                            verification code if needed.
                        </div>
                        {onResendCode && (
                            <button
                                type="button"
                                onClick={onResendCode}
                                className="text-[#29B54C] text-sm font-medium hover:underline cursor-pointer"
                            >
                                Resend code
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
