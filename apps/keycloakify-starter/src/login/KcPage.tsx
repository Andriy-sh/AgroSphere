import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";

const UserProfileFormFields = lazy(
    () => import("./UserProfileFormFields")
);

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));

    const Login = lazy(() => import("./pages/Login"));

    const LoginUpdatePassword = lazy(() => import("./pages/LoginUpdatePassword"));

    const Register = lazy(() => import("./pages/Register"));

    const LoginVerifyEmail = lazy(() => import("./pages/LoginVerifyEmail"));

    const LoginRecoveryAuthnCodeInput = lazy(
        () => import("./pages/LoginRecoveryAuthnCodeInput")
    );
    const EmailVerifiedSuccess = lazy(() => import("./pages/EmailVerifiedSuccess"));
    const InviteOrganisationCard = lazy(() => import("./pages/InviteOrganisationCard"));
    const InviteOrganisationCardExpired = lazy(
        () => import("./pages/InviteOrganisationCardExpired")
    );
    const RegisterInvite = lazy(() => import("./pages/RegisterInvite"));
    const OrganizationSelection = lazy(() => import("./pages/OrganizationSelection"));
    const RegisterAfterVerification = lazy(
        () => import("./pages/RegisterAfterVerification")
    );
    const EmailConfirmation = lazy(() => import("./pages/EmailConfirmation"));
    const EmailVerifiedFailed = lazy(() => import("./pages/EmailVerifiedFailed"));
    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login-reset-password.ftl":
                        return (
                            <LoginResetPassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login.ftl":
                        return (
                            <Login
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-update-password.ftl":
                        return (
                            <LoginUpdatePassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "register.ftl":
                        return (
                            <Register
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "login-verify-email.ftl":
                        return (
                            <LoginVerifyEmail
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-recovery-authn-code-input.ftl":
                        return (
                            <LoginRecoveryAuthnCodeInput
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "mail-verf-suc.ftl":
                        return (
                            <EmailVerifiedSuccess
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "invite-org.ftl":
                        return (
                            <InviteOrganisationCard
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "invite-org-expired.ftl":
                        return (
                            <InviteOrganisationCardExpired
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "invite-register.ftl":
                        return (
                            <RegisterInvite
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "organization-selection.ftl":
                        return (
                            <OrganizationSelection
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "register-after-verification.ftl":
                        return (
                            <RegisterAfterVerification
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "email-confirmation.ftl":
                        return (
                            <EmailConfirmation
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "mail-verf-fail.ftl":
                        return (
                            <EmailVerifiedFailed
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}
const classes = {} satisfies { [key in ClassKey]?: string };
