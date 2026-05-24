import type { JSX } from "keycloakify/tools/JSX";
import { useState, useEffect } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../KcContext";
import type { I18n } from "../../i18n";
import {
    emailSchema,
    baseNameSchema,
    passwordSchema
} from "../../schemas/register.schema";
import { z } from "zod";

import { EmailStep } from "./steps/EmailStep";
import { OtpStep } from "./steps/OtpStep";
import { NamePasswordStep } from "./steps/NamePasswordStep";
import { BusinessInfoStep } from "./steps/BusinessInfoStep";
import { ProgressIndicator } from "./ProgressIndicator";

type RegisterFormProps = {
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>;
    i18n: I18n;
    doUseDefaultCss: boolean;
    classes: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>["classes"];
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
    showRoleSelection?: boolean;
    prefillRole?: string;
    prefillOrganization?: string;
};

export function RegisterForm(props: RegisterFormProps) {
    const { kcContext, doUseDefaultCss, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url } = kcContext;

    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [userType, setUserType] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [businessCategory, setBusinessCategory] = useState("");
    const [farmCategory, setFarmCategory] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [timer, setTimer] = useState("00:30");
    const [isCodeIncorrect, setIsCodeIncorrect] = useState(false);
    const [correctOtp, setCorrectOtp] = useState<string>("1234");

    useEffect(() => {
        if (currentStep === 1) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    const [minutes, seconds] = prev.split(":").map(Number);
                    if (minutes === 0 && seconds === 0) {
                        return "00:00";
                    }
                    if (seconds === 0) {
                        return `${minutes - 1}:59`;
                    }
                    return `${minutes}:${seconds - 1 < 10 ? "0" : ""}${seconds - 1}`;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
        return undefined;
    }, [currentStep]);

    const handleEmailNext = () => {
        try {
            emailSchema.parse(email);
            setCurrentStep(1);
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
    };

    const handleOtpSubmit = () => {
        const otpString = otp.join("");
        if (otpString.length === 4) {
            if (otpString === correctOtp) {
                setIsCodeIncorrect(false);
                setCurrentStep(2);
            } else {
                setIsCodeIncorrect(true);
                setOtp(["", "", "", ""]);
                setTimeout(() => {
                    const firstInput = document.querySelector(
                        'input[type="text"]'
                    ) as HTMLInputElement;
                    firstInput?.focus();
                }, 100);
            }
        }
    };

    const handleOtpCancel = () => {
        setCurrentStep(0);
        setOtp(["", "", "", ""]);
        setIsCodeIncorrect(false);
    };

    const handleResendCode = () => {
        setTimer("00:30");
        setOtp(["", "", "", ""]);
        setIsCodeIncorrect(false);

        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setCorrectOtp(newOtp);

        setTimeout(() => {
            const firstInput = document.querySelector(
                'input[type="text"]'
            ) as HTMLInputElement;
            firstInput?.focus();
        }, 100);
    };

    const handleNamePasswordNext = () => {
        const newErrors: Record<string, string> = {};

        try {
            baseNameSchema.parse(firstName);
        } catch (zodError: unknown) {
            if (zodError instanceof z.ZodError) {
                newErrors.firstName = zodError.errors[0]?.message || "Invalid first name";
            }
        }

        try {
            baseNameSchema.parse(lastName);
        } catch (zodError: unknown) {
            if (zodError instanceof z.ZodError) {
                newErrors.lastName = zodError.errors[0]?.message || "Invalid last name";
            }
        }

        try {
            passwordSchema.parse(password);
        } catch (zodError: unknown) {
            if (zodError instanceof z.ZodError) {
                newErrors.password = zodError.errors[0]?.message || "Invalid password";
            }
        }

        if (password !== passwordConfirm) {
            newErrors.passwordConfirm = "Passwords do not match";
        } else if (newErrors.password) {
            newErrors.passwordConfirm = "Password must meet requirements";
        }

        if (Object.keys(newErrors).length === 0) {
            setCurrentStep(3);
            setErrors({});
        } else {
            setErrors(newErrors);
        }
    };

    const handleFinalSubmit = () => {
        if (!userType) {
            setErrors(prev => ({
                ...prev,
                userType: "Please select your type"
            }));
            return;
        }

        if (userType === "farmer") {
            if (!farmCategory) {
                setErrors(prev => ({
                    ...prev,
                    farmCategory: "Please select your farm category"
                }));
                return;
            }
        } else {
            if (!businessName.trim() || businessName.trim().length < 2) {
                setErrors(prev => ({
                    ...prev,
                    businessName: "Business name is required"
                }));
                return;
            }

            if (!businessType) {
                setErrors(prev => ({
                    ...prev,
                    businessType: "Please select business type"
                }));
                return;
            }

            if (!businessCategory) {
                setErrors(prev => ({
                    ...prev,
                    businessCategory: "Please select business category"
                }));
                return;
            }
        }

        const form = document.getElementById("kc-register-form") as HTMLFormElement;
        if (form) {
            const formData = new FormData(form);
            formData.set("email", email);
            formData.set("firstName", firstName);
            formData.set("lastName", lastName);
            formData.set("password", password);
            formData.set("passwordConfirm", passwordConfirm);
            formData.set("userType", userType);

            if (userType === "farmer") {
                formData.set("farmCategory", farmCategory);
                formData.set("businessName", "");
                formData.set("businessType", "");
                formData.set("businessCategory", "");
            } else {
                formData.set("businessName", businessName);
                formData.set("businessType", businessType);
                formData.set("businessCategory", businessCategory);
                formData.set("farmCategory", "");
            }

            form.submit();
        }
    };

    const handleOtpChange = (value: string[]) => {
        setOtp(value);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);

        if (value.length > 0) {
            try {
                passwordSchema.parse(value);
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.password;
                    return newErrors;
                });
            } catch (zodError: unknown) {
                if (zodError instanceof z.ZodError) {
                    setErrors(prev => ({
                        ...prev,
                        password: zodError.errors[0]?.message || "Invalid password"
                    }));
                }
            }
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.password;
                return newErrors;
            });
        }

        if (passwordConfirm.length > 0) {
            if (value === passwordConfirm) {
                if (!errors.password) {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.passwordConfirm;
                        return newErrors;
                    });
                }
            } else {
                setErrors(prev => ({
                    ...prev,
                    passwordConfirm: "Passwords do not match"
                }));
            }
        }
    };

    const handlePasswordConfirmChange = (value: string) => {
        setPasswordConfirm(value);

        if (value.length > 0) {
            if (value === password) {
                if (!errors.password) {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.passwordConfirm;
                        return newErrors;
                    });
                } else {
                    setErrors(prev => ({
                        ...prev,
                        passwordConfirm: "Password must meet requirements"
                    }));
                }
            } else {
                setErrors(prev => ({
                    ...prev,
                    passwordConfirm: "Passwords do not match"
                }));
            }
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.passwordConfirm;
                return newErrors;
            });
        }
    };

    const handleFirstNameChange = (value: string) => {
        setFirstName(value);

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
                        firstName: zodError.errors[0]?.message || "Invalid first name"
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
    };

    const handleLastNameChange = (value: string) => {
        setLastName(value);

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
                        lastName: zodError.errors[0]?.message || "Invalid last name"
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
    };

    return (
        <>
            <style>{`.kcFormGroupClass::before, .kcFormGroupClass::after { display: none !important; content: none !important; }`}</style>
            <form
                id="kc-register-form"
                className={`${kcClsx("kcFormClass")} hidden`}
                action={url.registrationAction}
                method="post"
            >
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="firstName" value={firstName} />
                <input type="hidden" name="lastName" value={lastName} />
                <input type="hidden" name="password" value={password} />
                <input type="hidden" name="passwordConfirm" value={passwordConfirm} />
                <input type="hidden" name="businessName" value={businessName} />
                <input type="hidden" name="businessType" value={businessType} />
                <input type="hidden" name="businessCategory" value={businessCategory} />
            </form>

            <div className="max-w-md mx-auto">
                {currentStep === 0 && (
                    <EmailStep
                        email={email}
                        onEmailChange={setEmail}
                        onNext={handleEmailNext}
                        error={errors.email}
                        setErrors={setErrors}
                        kcClsx={kcClsx}
                    />
                )}

                {currentStep === 1 && (
                    <OtpStep
                        otp={otp}
                        onOtpChange={handleOtpChange}
                        onCancel={handleOtpCancel}
                        onSubmit={handleOtpSubmit}
                        timer={timer}
                        onResendCode={handleResendCode}
                        isCodeIncorrect={isCodeIncorrect}
                        correctOtp={correctOtp}
                        kcClsx={kcClsx}
                    />
                )}

                {currentStep === 2 && (
                    <NamePasswordStep
                        email={email}
                        firstName={firstName}
                        lastName={lastName}
                        password={password}
                        passwordConfirm={passwordConfirm}
                        termsAccepted={termsAccepted}
                        onEmailChange={setEmail}
                        onTermsAcceptedChange={setTermsAccepted}
                        messagesPerField={{
                            existsError: () => false,
                            get: () => ""
                        }}
                        onFirstNameChange={handleFirstNameChange}
                        onLastNameChange={handleLastNameChange}
                        onPasswordChange={handlePasswordChange}
                        onPasswordConfirmChange={handlePasswordConfirmChange}
                        onNext={handleNamePasswordNext}
                        errors={errors}
                        setErrors={setErrors}
                        kcClsx={kcClsx}
                    />
                )}

                {currentStep === 3 && (
                    <BusinessInfoStep
                        userType={userType}
                        businessName={businessName}
                        businessType={businessType}
                        businessCategory={businessCategory}
                        farmCategory={farmCategory}
                        onUserTypeChange={setUserType}
                        onBusinessNameChange={setBusinessName}
                        onBusinessTypeChange={setBusinessType}
                        onBusinessCategoryChange={setBusinessCategory}
                        onFarmCategoryChange={setFarmCategory}
                        onBack={() => setCurrentStep(2)}
                        onNext={handleFinalSubmit}
                        errors={errors}
                        setErrors={setErrors}
                        kcClsx={kcClsx}
                    />
                )}
            </div>

            <ProgressIndicator currentStep={currentStep} />
        </>
    );
}
