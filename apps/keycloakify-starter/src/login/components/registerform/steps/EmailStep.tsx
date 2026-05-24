import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { emailSchema } from "../../../schemas/register.schema";
import { z } from "zod";
import { TextInput } from "../../TextInput";
import { Button } from "@@agrosphere/shared";

type EmailStepProps = {
    email: string;
    onEmailChange: (email: string) => void;
    onNext: () => void;
    error?: string;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    kcClsx: ReturnType<typeof getKcClsx>["kcClsx"];
};

export const EmailStep = ({
    email,
    onEmailChange,
    onNext,
    error,
    setErrors,
    kcClsx
}: EmailStepProps) => {
    let isEmailValid = false;
    try {
        emailSchema.parse(email);
        isEmailValid = true;
    } catch {
        isEmailValid = false;
    }

    const isButtonDisabled = !email.trim() || !isEmailValid;

    return (
        <div className={kcClsx("kcFormGroupClass")}>
            <TextInput
                id="email"
                name="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                type="email"
                onChange={value => {
                    onEmailChange(value);
                    if (value.length > 0) {
                        try {
                            emailSchema.parse(value);
                            setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.email;
                                return newErrors;
                            });
                        } catch (zodError: unknown) {
                            if (zodError instanceof z.ZodError) {
                                setErrors(prev => ({
                                    ...prev,
                                    email: zodError.errors[0]?.message || "Invalid email"
                                }));
                            }
                        }
                    } else {
                        setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.email;
                            return newErrors;
                        });
                    }
                }}
                error={error}
                kcClsx={kcClsx}
                validateOnChange={true}
                zodSchema={emailSchema}
            />
            <div className={kcClsx("kcFormGroupClass")}>
                <Button
                    variant="complete"
                    size="md"
                    type="button"
                    onClick={onNext}
                    className={`w-full h-9 !mt-2 ${
                        !isButtonDisabled
                            ? "bg-[#29B54C] !text-white"
                            : "opacity-50 bg-[#29B54C] cursor-not-allowed"
                    }`}
                    disabled={isButtonDisabled}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};
