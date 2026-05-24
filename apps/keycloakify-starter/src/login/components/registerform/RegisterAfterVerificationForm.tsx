import { useState, useEffect } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { NamePasswordStep } from "./steps/NamePasswordStep";
import { BusinessInfoStep } from "./steps/BusinessInfoStep";
import { getEmailFromUrl } from "../../utils/url-params";
import type { KcContext } from "../../KcContext";

type RegisterAfterVerificationFormProps = {
    kcClsx: ReturnType<typeof getKcClsx>["kcClsx"];
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    onComplete: (data: {
        firstName: string;
        lastName: string;
        password: string;
        userType: string;
        businessName: string;
        businessType: string;
        businessCategory: string;
        farmCategory: string;
        termsAccepted: boolean;
    }) => void;
};

export function RegisterAfterVerificationForm({
    kcClsx,
    messagesPerField,
    onComplete
}: RegisterAfterVerificationFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [userType, setUserType] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [businessCategory, setBusinessCategory] = useState("");
    const [farmCategory, setFarmCategory] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const emailFromUrl = getEmailFromUrl();
        if (emailFromUrl) {
            setEmail(emailFromUrl);
        }
    }, []);

    const handleNamePasswordNext = () => {
        setCurrentStep(1);
    };

    const handleBusinessInfoBack = () => {
        setCurrentStep(0);
    };

    const handleFinalSubmit = () => {
        onComplete({
            firstName,
            lastName,
            password,
            userType,
            businessName,
            businessType,
            businessCategory,
            farmCategory,
            termsAccepted
        });
    };

    return (
        <div className="space-y-6">
            {currentStep === 0 && (
                <NamePasswordStep
                    email={email}
                    onEmailChange={setEmail}
                    firstName={firstName}
                    lastName={lastName}
                    password={password}
                    passwordConfirm={passwordConfirm}
                    termsAccepted={termsAccepted}
                    onFirstNameChange={setFirstName}
                    onLastNameChange={setLastName}
                    onPasswordChange={setPassword}
                    onPasswordConfirmChange={setPasswordConfirm}
                    onTermsAcceptedChange={setTermsAccepted}
                    onNext={handleNamePasswordNext}
                    errors={errors}
                    setErrors={setErrors}
                    kcClsx={kcClsx}
                    messagesPerField={messagesPerField}
                />
            )}

            {currentStep === 1 && (
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
                    onBack={handleBusinessInfoBack}
                    onNext={handleFinalSubmit}
                    errors={errors}
                    setErrors={setErrors}
                    kcClsx={kcClsx}
                />
            )}
        </div>
    );
}
