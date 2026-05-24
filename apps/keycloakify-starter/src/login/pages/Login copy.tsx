import type { JSX } from "keycloakify/tools/JSX";
import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { FormError } from "../components/FormError";
import Link from "next/link";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(login.username ?? "");
    const [formErrors, setFormErrors] = useState<Partial<LoginFormData>>({});
    const [hasInteracted, setHasInteracted] = useState<Record<string, boolean>>({});
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const validateField = (field: keyof LoginFormData, value: string | boolean) => {
        try {
            const partialData: Partial<LoginFormData> = { [field]: value };
            const result = loginSchema.partial().safeParse(partialData);

            if (!result.success) {
                const fieldError = result.error.errors.find(err => err.path.length === 1 && err.path[0] === field);
                return fieldError?.message || null;
            }

            return null;
        } catch (error) {
            if (error instanceof Error) {
                return error.message;
            }
        }
        return null;
    };

    const validateForm = (formData: Partial<LoginFormData>) => {
        try {
            loginSchema.parse(formData);
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

    const handleFieldChange = (field: keyof LoginFormData, value: string | boolean) => {
        if (field === "username") {
            setUsername(value as string);
        } else if (field === "password") {
            setPassword(value as string);
        }

        setHasInteracted(prev => ({ ...prev, [field]: true }));

        const error = validateField(field, value);
        if (error) {
            setFormErrors(prev => ({ ...prev, [field]: error }));
        } else {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleFieldBlur = (field: keyof LoginFormData, value: string | boolean) => {
        const error = validateField(field, value);
        if (error) {
            setFormErrors(prev => ({ ...prev, [field]: error }));
        } else {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const shouldShowError = (field: keyof LoginFormData) => {
        return hasInteracted[field] || isFormSubmitted;
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <hr />
                            <h2>{msg("identity-provider-login-label")}</h2>
                            <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                                {social.providers.map((...[p, , providers]) => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            className={kcClsx(
                                                "kcFormSocialAccountListButtonClass",
                                                providers.length > 3 && "kcFormSocialAccountGridItem"
                                            )}
                                            type="button"
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                            <span
                                                className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                            ></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={e => {
                                e.preventDefault();
                                setIsLoginButtonDisabled(true);
                                setIsFormSubmitted(true);

                                const formData = {
                                    username: username,
                                    password: password,
                                    rememberMe: (e.target as HTMLFormElement).rememberMe?.checked || false
                                };

                                if (validateForm(formData)) {
                                    const form = e.target as HTMLFormElement;
                                    form.submit();
                                } else {
                                    setIsLoginButtonDisabled(false);
                                }
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <label htmlFor="username" className={kcClsx("kcLabelClass")}>
                                        {!realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")}
                                    </label>
                                    <input
                                        tabIndex={2}
                                        id="username"
                                        className={kcClsx("kcInputClass")}
                                        name="username"
                                        value={username}
                                        type="email"
                                        autoFocus
                                        autoComplete="username"
                                        aria-invalid={messagesPerField.existsError("username", "password") || !!formErrors.username}
                                        placeholder="Enter your email"
                                        onChange={e => handleFieldChange("username", e.target.value)}
                                        onBlur={e => handleFieldBlur("username", e.target.value)}
                                    />
                                    {(messagesPerField.existsError("username", "password") ||
                                        (formErrors.username && shouldShowError("username"))) && (
                                        <FormError
                                            message={formErrors.username || messagesPerField.getFirstError("username", "password") || ""}
                                            className={kcClsx("kcInputErrorMessageClass")}
                                        />
                                    )}
                                </div>
                            )}

                            <div className={kcClsx("kcFormGroupClass")}>
                                <label htmlFor="password" className={kcClsx("kcLabelClass")}>
                                    {msg("password")}
                                </label>
                                <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password">
                                    <input
                                        tabIndex={3}
                                        id="password"
                                        className={kcClsx("kcInputClass")}
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        aria-invalid={messagesPerField.existsError("username", "password") || !!formErrors.password}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => handleFieldChange("password", e.target.value)}
                                        onBlur={e => handleFieldBlur("password", e.target.value)}
                                    />
                                </PasswordWrapper>
                                {formErrors.password && shouldShowError("password") && (
                                    <FormError message={formErrors.password} className={kcClsx("kcInputErrorMessageClass")} />
                                )}
                            </div>

                            <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}
                                    id="kc-form-options"
                                >
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className="form-group">
                                            <div
                                                style={{ display: "flex", alignItems: "center", padding: "6px 4px" }}
                                                className={kcClsx("kcLabelWrapperClass")}
                                            >
                                                <input
                                                    style={{ margin: 0, borderColor: "#DBDEE8", width: 14, height: 14 }}
                                                    tabIndex={5}
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    type="checkbox"
                                                    defaultChecked={!!login.rememberMe}
                                                    className={kcClsx("kcCheckboxInputClass")}
                                                    aria-invalid={messagesPerField.existsError("termsAccepted") || !!formErrors.rememberMe}
                                                    onChange={e => handleFieldChange("rememberMe", e.target.checked)}
                                                    onBlur={e => handleFieldBlur("rememberMe", e.target.checked)}
                                                />
                                                <label
                                                    htmlFor="rememberMe"
                                                    className={kcClsx("kcLabelClass") + " !text-sm !font-medium !ml-2 !cursor-pointer "}
                                                >
                                                    {msg("rememberMe")}
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={kcClsx("kcFormOptionsWrapperClass")}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        fontSize: 14,
                                        fontWeight: 500,
                                        lineHeight: "140%"
                                    }}
                                >
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <Link tabIndex={6} href={url.loginResetCredentialsUrl}>
                                                {msg("doForgotPassword")}
                                            </Link>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <input
                                    tabIndex={7}
                                    disabled={isLoginButtonDisabled}
                                    className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                                    name="login"
                                    id="kc-login"
                                    type="submit"
                                    value={msgStr("doLogIn")}
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}

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
                <span className="material-symbols-outlined" aria-hidden style={{ width: 18, height: 12, color: "#818D99", fontSize: 20 }}>
                    {isPasswordRevealed ? "visibility_off" : "visibility"}
                </span>
            </button>
        </div>
    );
}
