import type { JSX } from "keycloakify/tools/JSX";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useState } from "react";
import { updatePasswordSchema, type UpdatePasswordFormData } from "../schemas/update-password.schema";
import { FormError } from "../components/FormError";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msg } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const validateForm = (formData: UpdatePasswordFormData) => {
        try {
            updatePasswordSchema.parse(formData);
            setFormErrors({});
            return true;
        } catch (error) {
            if (error instanceof Error) {
                const zodError = error as { errors?: Array<{ path: string[]; message: string }> };
                const errors: Record<string, string> = {};
                zodError.errors?.forEach(err => {
                    if (err.path && err.path.length > 0) {
                        errors[err.path[0]] = err.message;
                    }
                });
                setFormErrors(errors);
            }
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: UpdatePasswordFormData = {
            password: password,
            passwordConfirm: passwordConfirm
        };

        if (validateForm(formData)) {
            // If validation passes, submit the form
            const form = e.target as HTMLFormElement;
            form.submit();
        }
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={msg("updatePasswordTitle")}
        >
            <form id="kc-passwd-update-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post" onSubmit={handleSubmit}>
                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <label htmlFor="password-new" className={kcClsx("kcLabelClass")}>
                            {msg("passwordNew")}
                        </label>
                    </div>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password-new">
                            <input
                                type="password"
                                id="password-new"
                                name="password-new"
                                className={kcClsx("kcInputClass")}
                                autoFocus
                                placeholder="Enter password"
                                autoComplete="new-password"
                                aria-invalid={messagesPerField.existsError("password", "password-confirm") || !!formErrors.password}
                                value={password}
                                onChange={e => {
                                    const val = e.target.value;
                                    setPassword(val);
                                    if (formErrors.password && val.length >= 6 && val.length <= 72) {
                                        setFormErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.password;
                                            return newErrors;
                                        });
                                    }
                                    if (formErrors.passwordConfirm && val === passwordConfirm) {
                                        setFormErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.passwordConfirm;
                                            return newErrors;
                                        });
                                    }
                                }}
                            />
                        </PasswordWrapper>

                        {(messagesPerField.existsError("password") || formErrors.password) && (
                            <FormError
                                message={formErrors.password || messagesPerField.get("password") || ""}
                                className={kcClsx("kcInputErrorMessageClass")}
                            />
                        )}
                    </div>
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <label htmlFor="password-confirm" className={kcClsx("kcLabelClass")}>
                            {msg("passwordConfirm")}
                        </label>
                    </div>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password-confirm">
                            <input
                                type="password"
                                id="password-confirm"
                                name="password-confirm"
                                className={kcClsx("kcInputClass")}
                                autoComplete="new-password"
                                placeholder="Enter password"
                                aria-invalid={messagesPerField.existsError("password", "password-confirm") || !!formErrors.passwordConfirm}
                                value={passwordConfirm}
                                onChange={e => {
                                    const val = e.target.value;
                                    setPasswordConfirm(val);
                                    if (formErrors.passwordConfirm && val === password) {
                                        setFormErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.passwordConfirm;
                                            return newErrors;
                                        });
                                    }
                                }}
                            />
                        </PasswordWrapper>

                        {(messagesPerField.existsError("password-confirm") || formErrors.passwordConfirm) && (
                            <FormError
                                message={formErrors.passwordConfirm || messagesPerField.get("password-confirm") || ""}
                                className={kcClsx("kcInputErrorMessageClass")}
                            />
                        )}
                    </div>
                </div>
                <div className={kcClsx("kcFormGroupClass")}>
                    {/* <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} /> */}
                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <input
                            className={kcClsx(
                                "kcButtonClass",
                                "kcButtonPrimaryClass",
                                !isAppInitiatedAction && "kcButtonBlockClass",
                                "kcButtonLargeClass"
                            )}
                            type="submit"
                            value={"Change password"}
                        />
                        {isAppInitiatedAction && (
                            <button
                                className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonLargeClass")}
                                type="submit"
                                name="cancel-aia"
                                value="true"
                            >
                                {msg("doCancel")}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </Template>
    );
}

// function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
//     const { kcClsx, i18n } = props;

//     const { msg } = i18n;

//     return (
//         <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
//             <div className={kcClsx("kcFormOptionsWrapperClass")}>
//                 <div className="checkbox">
//                     <label>
//                         <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />
//                         {msg("logoutOtherSessions")}
//                     </label>
//                 </div>
//             </div>
//         </div>
//     );
// }

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { kcClsx, i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

    return (
        <div className={kcClsx("kcInputGroup")}>
            {children}
            <button
                type="button"
                className={kcClsx("kcFormPasswordVisibilityButtonClass")}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {/* <i className={kcClsx(isPasswordRevealed ? "kcFormPasswordVisibilityIconHide" : "kcFormPasswordVisibilityIconShow")} aria-hidden /> */}

                <span className="material-symbols-outlined" aria-hidden style={{ width: 18, height: 12, color: "#818D99", fontSize: 20 }}>
                    {isPasswordRevealed ? "visibility_off" : "visibility"}
                </span>
            </button>
        </div>
    );
}
