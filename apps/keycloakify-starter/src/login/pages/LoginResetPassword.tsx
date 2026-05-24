import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { validateResetPassword, type ResetPasswordValidationResult } from "../schemas/reset-password.schema";
import { FormError } from "../components/FormError";
import { useState, useCallback, useEffect } from "react";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, realm, auth, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [email, setEmail] = useState(auth.attemptedUsername ?? "");
    const [validationResult, setValidationResult] = useState<ResetPasswordValidationResult>({ success: false });
    const [isValidating, setIsValidating] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const debouncedValidation = useCallback(
        (() => {
            let timeoutId: NodeJS.Timeout;
            return (emailValue: string) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (emailValue.trim()) {
                        setIsValidating(true);
                        const result = validateResetPassword({ email: emailValue });
                        setValidationResult(result);
                        setIsValidating(false);
                    } else {
                        setValidationResult({ success: false });
                    }
                }, 300);
            };
        })(),
        []
    );

    useEffect(() => {
        if (hasInteracted) {
            debouncedValidation(email);
        }
    }, [email, hasInteracted, debouncedValidation]);

    const getErrorMessage = (): string | null => {
        if (messagesPerField.existsError("email")) {
            return messagesPerField.get("email");
        }

        if (!validationResult.success && validationResult.errors?.email) {
            return validationResult.errors.email[0];
        }

        return null;
    };

    const hasError = (): boolean => {
        return messagesPerField.existsError("email") || (!validationResult.success && !!validationResult.errors?.email);
    };

    const isValid = (): boolean => {
        return hasInteracted && email.trim().length > 0 && validationResult.success && !hasError();
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setHasInteracted(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = validateResetPassword({ email });
        setValidationResult(result);
        setHasInteracted(true);

        if (result.success) {
            const form = e.target as HTMLFormElement;
            form.submit();
        }
    };

    const handleCancel = () => {
        window.location.href = url.loginUrl;
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            displayMessage={!messagesPerField.existsError("username")}
            infoNode={realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
            headerNode={msg("emailForgotTitle")}
        >
            <form
                id="kc-reset-password-form"
                className={kcClsx("kcFormClass")}
                action={url.loginAction}
                method="post"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <label htmlFor="email" className={kcClsx("kcLabelClass")}>
                            {!realm.loginWithEmailAllowed
                                ? msg("username")
                                : !realm.registrationEmailAsUsername
                                  ? msg("usernameOrEmail")
                                  : msg("email")}
                        </label>
                    </div>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email address"
                                className={`${kcClsx("kcInputClass")}  ${hasError() ? "border-red-500 focus:border-red-500" : ""} ${
                                    isValid() ? "border-green-500 focus:border-green-500" : ""
                                }`.trim()}
                                autoFocus
                                value={email}
                                aria-invalid={hasError()}
                                aria-describedby={hasError() ? "email-error" : undefined}
                                onChange={handleEmailChange}
                                onBlur={() => setHasInteracted(true)}
                                disabled={isValidating}
                            />
                        </div>

                        {hasError() && <FormError message={getErrorMessage() || ""} className={kcClsx("kcInputErrorMessageClass")} />}
                    </div>
                </div>

                <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                    <div className={`${kcClsx("kcFormButtonsClass")} button-row`}>
                        <button
                            type="button"
                            className={`${kcClsx("kcButtonClass")} kcButtonCancelClass`}
                            style={{ fontSize: "14px", color: "#818D99" }}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <input
                            style={{
                                fontSize: "14px",
                                color: "#fff",
                                background: isValid() ? "#29B54C" : "#9CA3AF",
                                cursor: isValid() ? "pointer" : "not-allowed",
                                opacity: isValid() ? 1 : 0.6,
                                transition: "all 0.2s ease-in-out"
                            }}
                            className={`${kcClsx("kcButtonClass", "kcButtonPrimaryClass")}`}
                            type="submit"
                            value={isValidating ? "Validating..." : msgStr("doSubmit")}
                            disabled={!isValid() || isValidating}
                            title={!isValid() ? "Please enter a valid email address" : ""}
                        />
                    </div>
                </div>
            </form>
        </Template>
    );
}
