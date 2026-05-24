import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { baseNameSchema, emailSchema } from "../../../schemas/register.schema";
import { z } from "zod";
import { TextInput } from "../../TextInput";
import { PasswordInput } from "../../PasswordInput";
import { PasswordRequirements } from "../../PasswordRequirements";
import { Button } from "@@agrosphere/shared";
import { getEmailFromUrl } from "../../../utils/url-params";
import { TermsAcceptance } from "../../TermsAcceptance";
import type { KcContext } from "../../../KcContext";

type NamePasswordStepProps = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirm: string;
    termsAccepted: boolean;
    onEmailChange: (value: string) => void;
    onFirstNameChange: (value: string) => void;
    onLastNameChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onPasswordConfirmChange: (value: string) => void;
    onTermsAcceptedChange: (value: boolean) => void;
    onNext: () => void;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    kcClsx: ReturnType<typeof getKcClsx>["kcClsx"];
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
};

export const NamePasswordStep = ({
    email,
    firstName,
    lastName,
    password,
    passwordConfirm,
    termsAccepted,
    onEmailChange,
    onFirstNameChange,
    onLastNameChange,
    onPasswordChange,
    onPasswordConfirmChange,
    onTermsAcceptedChange,
    onNext,
    errors,
    setErrors,
    kcClsx,
    messagesPerField
}: NamePasswordStepProps) => {
    const isFirstNameValid = firstName.trim().length >= 2 && !errors.firstName;
    const isLastNameValid = lastName.trim().length >= 2 && !errors.lastName;

    const isPasswordValid = password.trim().length > 0 && !errors.password;
    const isPasswordConfirmValid =
        passwordConfirm.trim().length > 0 &&
        password === passwordConfirm &&
        !errors.passwordConfirm;

    const arePasswordsValid =
        isPasswordValid && isPasswordConfirmValid && password === passwordConfirm;

    const isTermsAccepted = termsAccepted && !errors.termsAccepted;

    const isFormValid =
        isFirstNameValid && isLastNameValid && arePasswordsValid && isTermsAccepted;

    const emailFromUrl = getEmailFromUrl();
    const isEmailReadonly = Boolean(emailFromUrl && email === emailFromUrl);

    return (
        <>
            <div className="flex-1">
                <TextInput
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={value => {    
                        if (!isEmailReadonly) {
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
                                            email:
                                                zodError.errors[0]?.message ||
                                                "Invalid email"
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
                        }
                    }}
                    error={errors.email}
                    kcClsx={kcClsx}
                    validateOnChange={true}
                    type="email"
                    zodSchema={emailSchema}
                    readonly={isEmailReadonly}
                />
            </div>
            <div className={`${kcClsx("kcFormGroupClass")} flex gap-3`}>
                <div className="flex-1">
                    <TextInput
                        id="firstName"
                        name="firstName"
                        label="First name"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={value => {
                            onFirstNameChange(value);
                            if (value.length > 0) {
                                try {
                                    baseNameSchema.parse(value);
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.firstName;
                                        return newErrors;
                                    });
                                } catch (zodError: unknown) {
                                    if (zodError instanceof z.ZodError) {
                                        setErrors(prev => ({
                                            ...prev,
                                            firstName:
                                                zodError.errors[0]?.message ||
                                                "Invalid first name"
                                        }));
                                    }
                                }
                            } else {
                                setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.firstName;
                                    return newErrors;
                                });
                            }
                        }}
                        error={errors.firstName}
                        kcClsx={kcClsx}
                        validateOnChange={true}
                        minLength={2}
                        zodSchema={baseNameSchema}
                    />
                </div>
                <div className="flex-1">
                    <TextInput
                        id="lastName"
                        name="lastName"
                        label="Last name"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={value => {
                            onLastNameChange(value);
                            if (value.length > 0) {
                                try {
                                    baseNameSchema.parse(value);
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.lastName;
                                        return newErrors;
                                    });
                                } catch (zodError: unknown) {
                                    if (zodError instanceof z.ZodError) {
                                        setErrors(prev => ({
                                            ...prev,
                                            lastName:
                                                zodError.errors[0]?.message ||
                                                "Invalid last name"
                                        }));
                                    }
                                }
                            } else {
                                setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.lastName;
                                    return newErrors;
                                });
                            }
                        }}
                        error={errors.lastName}
                        kcClsx={kcClsx}
                        validateOnChange={true}
                        minLength={2}
                        zodSchema={baseNameSchema}
                    />
                </div>
            </div>
            <div className={kcClsx("kcFormGroupClass")}>
                <PasswordInput
                    id="password"
                    name="password"
                    label="Create password"
                    placeholder="Enter password"
                    value={password}
                    onChange={value => {
                        onPasswordChange(value);
                    }}
                    error={errors.password}
                    kcClsx={kcClsx}
                    className="text-xs font-normal text-gray-900"
                    validateOnChange={true}
                    confirmPassword={passwordConfirm}
                    showRequirements={true}
                />
            </div>
            <div className={kcClsx("kcFormGroupClass")}>
                <PasswordInput
                    id="passwordConfirm"
                    name="passwordConfirm"
                    label="Confirm password"
                    placeholder="Enter password"
                    value={passwordConfirm}
                    onChange={value => {
                        onPasswordConfirmChange(value);
                    }}
                    error={errors.passwordConfirm}
                    kcClsx={kcClsx}
                    className="text-xs font-normal text-gray-900"
                    validateOnChange={true}
                    confirmPassword={password}
                />
                <PasswordRequirements password={password} kcClsx={kcClsx} show={true} />
            </div>

            <div className={kcClsx("kcFormGroupClass")}>
                <TermsAcceptance
                    kcClsx={kcClsx}
                    messagesPerField={messagesPerField}
                    areTermsAccepted={termsAccepted}
                    onAreTermsAcceptedValueChange={onTermsAcceptedChange}
                    errors={errors}
                    setErrors={setErrors}
                />
            </div>

            <div className={kcClsx("kcFormGroupClass")}>
                <Button
                    variant="complete"
                    size="md"
                    type="button"
                    onClick={onNext}
                    className={`w-full h-9 !mt-2 ${
                        isFormValid
                            ? "bg-[#29B54C] !text-white"
                            : "opacity-50 bg-[#29B54C] cursor-not-allowed"
                    }`}
                    disabled={!isFormValid}
                >
                    Next
                </Button>
            </div>
        </>
    );
};
