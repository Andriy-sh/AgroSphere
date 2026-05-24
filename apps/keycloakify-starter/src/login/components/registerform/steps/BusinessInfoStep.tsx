import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { TextInput } from "../../TextInput";
import { RadioInput } from "../../RadioInput";
import { Button } from "@@agrosphere/shared";

type BusinessInfoStepProps = {
    userType: string;
    businessName: string;
    businessType: string;
    businessCategory: string;
    farmCategory: string;
    onUserTypeChange: (value: string) => void;
    onBusinessNameChange: (value: string) => void;
    onBusinessTypeChange: (value: string) => void;
    onBusinessCategoryChange: (value: string) => void;
    onFarmCategoryChange: (value: string) => void;
    onBack: () => void;
    onNext: () => void;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    kcClsx: ReturnType<typeof getKcClsx>["kcClsx"];
};

const UserTypeSelector = ({
    userType,
    onUserTypeChange,
    errors,
    setErrors
}: {
    userType: string;
    onUserTypeChange: (value: string) => void;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) => {
    const options = [
        {
            value: "farmer",
            label: "I'm a farmer",
            icon: "psychiatry"
        },
        {
            value: "agri-business",
            label: "I'm an agri-business",
            icon: "home_work"
        }
    ];

    return (
        <div className="space-y-3">
            <div className="text-sm font-medium text-gray-900 mb-3">
                Please select your account type
            </div>
            <div className="flex gap-2">
                {options.map(option => {
                    const isSelected = userType === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onUserTypeChange(option.value);
                                if (errors.userType) {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.userType;
                                        return newErrors;
                                    });
                                }
                            }}
                            className={`flex-1 flex items-center p-2 rounded-lg border-2 transition-all duration-200 ${
                                isSelected
                                    ? "border-[#29B54C] bg-white"
                                    : "border-gray-300 bg-white hover:border-[#29B54C] hover:shadow-sm"
                            }`}
                        >   
                            <input
                                type="radio"
                                name="userType"
                                value={option.value}
                                checked={isSelected}
                                onChange={() => {}}
                                className="sr-only"
                            />
                            <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                    isSelected ? "bg-[#00AF4D1F]" : "bg-[#00AF4D1F]"
                                }`}
                            >
                                <span className="material-symbols-outlined text-sm text-[#29B54C] font-normal">
                                    {option.icon}
                                </span>
                            </div>

                            <span className={`flex-1 text-sm text-[#101010] font-medium`}>
                                {option.label}
                            </span>
                            <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                                    isSelected ? "border-[#29B54C]" : "border-gray-300"
                                }`}
                            >
                                {isSelected && (
                                    <div className="w-2 h-2 bg-[#29B54C] rounded-full" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
            {errors.userType && (
                <div className="text-red-500 text-xs mt-1">{errors.userType}</div>
            )}
        </div>
    );
};

export const BusinessInfoStep = ({
    userType,
    businessName,
    businessType,
    businessCategory,
    farmCategory,
    onUserTypeChange,
    onBusinessNameChange,
    onBusinessTypeChange,
    onBusinessCategoryChange,
    onFarmCategoryChange,
    onBack,
    onNext,
    errors,
    setErrors,
    kcClsx
}: BusinessInfoStepProps) => {
    const isUserTypeValid = userType && userType.length > 0 && !errors.userType;

    const isFarmerValid =
        userType === "farmer"
            ? businessType &&
              businessType.length > 0 &&
              businessName &&
              businessName.trim().length >= 2 &&
              farmCategory &&
              farmCategory.length > 0 &&
              !errors.businessType &&
              !errors.businessName &&
              !errors.farmCategory
            : true;

    const isAgriBusinessValid =
        userType === "agri-business"
            ? businessName &&
              businessName.trim().length >= 2 &&
              businessType &&
              businessType.length > 0 &&
              businessCategory &&
              businessCategory.length > 0 &&
              !errors.businessName &&
              !errors.businessType &&
              !errors.businessCategory
            : true;

    const isFormValid = isUserTypeValid && isFarmerValid && isAgriBusinessValid;

    return (
        <>
            <div className={kcClsx("kcFormGroupClass")}>
                <UserTypeSelector
                    userType={userType}
                    onUserTypeChange={onUserTypeChange}
                    errors={errors}
                    setErrors={setErrors}
                />
            </div>

            {userType === "agri-business" && (
                <>
                    <div className={kcClsx("kcFormGroupClass")}>
                        <RadioInput
                            name="businessType"
                            options={[
                                { value: "Solo trader", label: "Solo trader" },
                                { value: "Limited company", label: "Limited company" },
                                { value: "Other", label: "Other" }
                            ]}
                            value={businessType}
                            onChange={value => {
                                onBusinessTypeChange(value);
                                if (errors.businessType) {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.businessType;
                                        return newErrors;
                                    });
                                }
                            }}
                            label="Please select your business type"
                            error={errors.businessType}
                            layout="single-column"
                        />
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <TextInput
                            id="businessName"
                            name="businessName"
                            label="Business name"
                            placeholder="Enter business or legal name"
                            value={businessName}
                            onChange={value => {
                                onBusinessNameChange(value);
                                if (value.length > 0) {
                                    if (value.trim().length >= 2) {
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.businessName;
                                            return newErrors;
                                        });
                                    } else {
                                        setErrors(prev => ({
                                            ...prev,
                                            businessName:
                                                "Business name must be at least 2 characters"
                                        }));
                                    }
                                } else {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.businessName;
                                        return newErrors;
                                    });
                                }
                            }}
                            error={errors.businessName}
                            kcClsx={kcClsx}
                            validateOnChange={true}
                            minLength={2}
                        />
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <RadioInput
                            name="businessCategory"
                            options={[
                                {
                                    value: "Advisor/Agronomist",
                                    label: "Advisor/Agronomist"
                                },
                                { value: "Contractor", label: "Contractor" },
                                { value: "Agri-Merchant", label: "Agri-Merchant" },
                                { value: "Co-operative", label: "Co-operative" }
                            ]}
                            value={businessCategory}
                            onChange={value => {
                                onBusinessCategoryChange(value);
                                if (errors.businessCategory) {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.businessCategory;
                                        return newErrors;
                                    });
                                }
                            }}
                            label="Select your category"
                            error={errors.businessCategory}
                            layout="two-columns"
                        />
                    </div>
                </>
            )}

            {userType === "farmer" && (
                <>
                    <div className={kcClsx("kcFormGroupClass")}>
                        <RadioInput
                            name="businessType"
                            options={[
                                { value: "Solo trader", label: "Solo trader" },
                                { value: "Farm partnership", label: "Farm partnership" },
                                { value: "Limited company", label: "Limited company" },
                                { value: "Other", label: "Other" }
                            ]}
                            value={businessType}
                            onChange={value => {
                                onBusinessTypeChange(value);
                                if (errors.businessType) {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.businessType;
                                        return newErrors;
                                    });
                                }
                            }}
                            label="Please select your business type"
                            error={errors.businessType}
                            layout="two-columns"
                        />
                    </div>

                    

                    <div className={kcClsx("kcFormGroupClass")}>
                        <TextInput
                            id="businessName"
                            name="businessName"
                            label="Business name"
                            placeholder="Enter business name"
                            value={businessName}
                            onChange={value => {
                                onBusinessNameChange(value);
                                if (value.length > 0) {
                                    if (value.trim().length >= 2) {
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.businessName;
                                            return newErrors;
                                        });
                                    } else {
                                        setErrors(prev => ({
                                            ...prev,
                                            businessName:
                                                "Business name must be at least 2 characters"
                                        }));
                                    }
                                } else {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.businessName;
                                        return newErrors;
                                    });
                                }
                            }}
                            error={errors.businessName}
                            kcClsx={kcClsx}
                            validateOnChange={true}
                            minLength={2}
                        />
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <RadioInput
                            name="farmCategory"
                            options={[
                                { value: "Dairy", label: "Dairy" },
                                { value: "Beef", label: "Beef" },
                                { value: "Tillage", label: "Tillage" },
                                { value: "Mixed livestock", label: "Mixed livestock" },
                                {
                                    value: "Mixed livestock/Cereals",
                                    label: "Mixed livestock/Cereals"
                                },
                                { value: "Other", label: "Other" }
                            ]}
                            value={farmCategory}
                            onChange={value => {
                                onFarmCategoryChange(value);
                                if (errors.farmCategory) {
                                    setErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.farmCategory;
                                        return newErrors;
                                    });
                                }
                            }}
                            label="Select your category"
                            error={errors.farmCategory}
                            layout="two-columns"
                        />
                    </div>
                </>
            )}

            <div className="flex gap-3">
                <Button
                    variant="cancel"
                    size="md"
                    type="button"
                    onClick={onBack}
                    className="flex-1 !bg-[#EEF0F6] h-9 !text-[#101010]"
                >
                    Back
                </Button>
                <Button
                    variant="complete"
                    size="md"
                    type="button"
                    onClick={onNext}
                    className={`flex-1 ${
                        isFormValid
                            ? "bg-[#29B54C] !text-white"
                            : "opacity-50 bg-[#29B54C] cursor-not-allowed"
                    }`}
                    disabled={!isFormValid}
                >
                    Create account
                </Button>
            </div>
        </>
    );
};
