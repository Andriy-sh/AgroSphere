import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";

interface TermsAcceptanceProps {
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function TermsAcceptance({
    kcClsx,
    messagesPerField,
    areTermsAccepted,
    onAreTermsAcceptedValueChange,
    errors,
    setErrors
}: TermsAcceptanceProps) {
    return (
        <div className="form-group">
            <div className="flex items-center py-1.5">
                <div className="relative">
                    <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        className={`${kcClsx("kcCheckboxInputClass")} !w-5 !h-5 !m-0 !appearance-none border-1 !border-[#DBDEE8] rounded cursor-pointer transition-all duration-200 ease-in-out focus:none ${
                            areTermsAccepted ? "!bg-[#29B54C]" : "!bg-transparent"
                        }`}
                        checked={areTermsAccepted}
                        required
                        onChange={e => {
                            const checked = e.target.checked;
                            onAreTermsAcceptedValueChange(checked);
                            if (errors.termsAccepted && checked) {
                                setErrors(prev => {
                                    const newErrors = { ...prev };
                                    delete newErrors.termsAccepted;
                                    return newErrors;
                                });
                            }
                        }}
                        aria-invalid={messagesPerField.existsError("termsAccepted")}
                    />
                    
                    {areTermsAccepted && (
                        <div className="absolute mb-1 inset-0 flex items-center justify-center pointer-events-none">
                            <svg
                                width="8"
                                height="6"
                                viewBox="0 0 8 6"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-2.5 h-2"
                            >
                                <path
                                    d="M1 3L3 5L7 1"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                    )}
                </div>
                <label
                    htmlFor="termsAccepted"
                    className="!text-sm !font-medium ml-2 cursor-pointer"
                >
                    I agree with the{" "}
                    <a href="/" className="!text-[#29B54C] hover:underline">
                        Terms and Conditions
                    </a>
                </label>
            </div>
            {messagesPerField.existsError("termsAccepted") && (
                <div className={kcClsx("kcLabelWrapperClass")}>
                    <span
                        id="input-error-terms-accepted"
                        className={kcClsx("kcInputErrorMessageClass")}
                        aria-live="polite"
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(messagesPerField.get("termsAccepted"))
                        }}
                    />
                </div>
            )}
        </div>
    );
}
