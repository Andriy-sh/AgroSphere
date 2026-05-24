import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import "./main.css";
import { LeftShowcase } from "./components/LeftShowcase";
import Logo from "./assets/logo.png";
interface AuthHeaderProps {
    logoSrc?: string;
    title: string;
    description?: string;
    linkText?: string;
    linkHref?: string;
}

const AuthHeader = ({ logoSrc = Logo, title, description, linkText, linkHref }: AuthHeaderProps) => (
    <div className="flex flex-col items-center">
        <img src={logoSrc} alt="Logo" className="w-[clamp(24px,4vw,32px)] h-[clamp(24px,4vw,32px)]" />
        <h1 className="!font-[550] !text-[clamp(24px,4vw,32px)] m-0 !text-[#111] leading-[1.1] mb-2" style={{ textTransform: "none" }}>
            {title}
        </h1>
        <div
            className="text-[clamp(12px,2vw,16px)] leading-[1.5] text-[#222] font-medium"
            style={{ textTransform: "none", padding: "0 clamp(20px,5vw,50px)" }}
        >
            {description}
            {linkText && linkHref && (
                <>
                    {" "}
                    <a href={linkHref} className="!text-[#29B54C] font-medium no-underline" style={{ textTransform: "none" }}>
                        {linkText}
                    </a>
                </>
            )}
        </div>
    </div>
);

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayMessage = true,
        socialProvidersNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className="page-wrapper">
            <div className="left-side">
                <LeftShowcase
                    variant={(() => {
                        switch (kcContext.pageId) {
                            case "register.ftl":
                            case "email-confirmation.ftl":
                                return "register";
                            case "login-reset-password.ftl":
                            case "invite-org.ftl":
                            case "invite-org-expired.ftl":
                            case "invite-register.ftl":
                                return "invite";
                            case "login.ftl":
                            case "mail-verf-fail.ftl":
                            default:
                                return "login";
                        }
                    })()}
                />
            </div>
            <div className="right-side">
                <div className="w-full px-16 max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-[900px]">
                    <div
                        className={kcClsx("kcLoginClass")}
                        style={{
                            boxShadow: "0 2px 24px 0 rgba(42, 42, 42, 0.08)",
                            borderRadius: 16,
                            border: "1px solid #F1F3F9",
                            background: "#fff",
                            margin: "clamp(0vw, 4vw, 4vw)",
                            minHeight: "auto"
                        }}
                    >
                        <div id="kc-header" className={kcClsx("kcHeaderClass")}>
                            <div id="kc-header-wrapper" className={kcClsx("kcHeaderWrapperClass")}>
                                {(() => {
                                    switch (kcContext.pageId) {
                                        case "login.ftl":
                                            return (
                                                <AuthHeader
                                                    title="Welcome back!"
                                                    description="Don't have an account?"
                                                    linkText="Sing up"
                                                    linkHref={"registrationUrl" in url ? url.registrationUrl : "/register"}
                                                />
                                            );
                                        case "register.ftl":
                                            return (
                                                <AuthHeader
                                                    title="Create account!"
                                                    description="Already have an account?"
                                                    linkText="Sing in"
                                                    linkHref={url.loginUrl}
                                                />
                                            );
                                        case "login-reset-password.ftl":
                                            return (
                                                <AuthHeader
                                                    title="Reset your password!"
                                                    description="Enter the email address you used to register, and we'll send you a link to reset your password."
                                                />
                                            );
                                        case "login-verify-email.ftl":
                                            return (
                                                <AuthHeader
                                                    title="Verify your email address!"
                                                    description="We have sent a verification link to john.doe@agency.inc. Please check your inbox and click the link to continue.  "
                                                />
                                            );
                                        case "login-update-password.ftl":
                                            return (
                                                <AuthHeader
                                                    title="New password!"
                                                    description="Your password must have: Between 6 and 72 characters, letters, numbers"
                                                />
                                            );
                                        case "login-recovery-authn-code-input.ftl":
                                            return (
                                                <AuthHeader
                                                    title="Verify your email address!"
                                                    description="We sent the OTP code to james.anderson129@gmail.com."
                                                />
                                            );
                                        case "mail-verf-suc.ftl":
                                            return (
                                                <AuthHeader
                                                    title="Email verified successfully!"
                                                    description="Your email address has been successfully verified. You may now proceed to the next step in your registration."
                                                />
                                            );
                                        case "invite-org.ftl":
                                            return <AuthHeader title="Welcome!" />;
                                        case "invite-org-expired.ftl":
                                            return <AuthHeader title="Invitation link expired!" />;
                                        case "invite-register.ftl":
                                            return (
                                                <AuthHeader
                                                    title="Create account!"
                                                    description="Already have an account?"
                                                    linkText="Sing in"
                                                    linkHref="/login"
                                                />
                                            );
                                        case "email-confirmation.ftl":
                                            return (
                                                <AuthHeader
                                                    title="Create account!"
                                                    description="Already have an account?"
                                                    linkText="Sign in"
                                                    linkHref="/login"
                                                />
                                            );
                                        case "organization-selection.ftl":
                                            return (
                                                <AuthHeader
                                                    title="Select an organisation to continue"
                                                    description="Your account is linked to these organisations."
                                                />
                                            );
                                        case "mail-verf-fail.ftl":
                                            return (
                                                <AuthHeader
                                                    title="Email verification failed!"
                                                    description="We couldn't verify your email. The link may have expired or is invalid. Please try again or request a new verification link."
                                                />
                                            );
                                        default:
                                            return <AuthHeader title="Welcome!" description="Please sign in or create an account." />;
                                    }
                                })()}
                            </div>
                        </div>
                        <div className={kcClsx("kcFormCardClass")} style={{ border: "none", boxShadow: "none" }}>
                            <div id="kc-content">
                                <div id="kc-content-wrapper" className="!mt-1">
                                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                                        <div
                                            className={clsx(
                                                `alert-${message.type}`,
                                                kcClsx("kcAlertClass"),
                                                `pf-m-${message?.type === "error" ? "danger" : message.type}`
                                            )}
                                        >
                                            <div className="pf-c-alert__icon">
                                                {message.type === "success" && <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                                                {message.type === "warning" && <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                                                {message.type === "error" && <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                                                {message.type === "info" && <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                                            </div>
                                            <span
                                                className={kcClsx("kcAlertTitleClass")}
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(message.summary)
                                                }}
                                            />
                                        </div>
                                    )}
                                    {children}
                                    {auth !== undefined && auth.showTryAnotherWayLink && (
                                        <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                            <div className={kcClsx("kcFormGroupClass")}>
                                                <input type="hidden" name="tryAnotherWay" value="on" />
                                                <a
                                                    href="#"
                                                    id="try-another-way"
                                                    onClick={() => {
                                                        document.forms["kc-select-try-another-way-form" as never].submit();
                                                        return false;
                                                    }}
                                                >
                                                    {msg("doTryAnotherWay")}
                                                </a>
                                            </div>
                                        </form>
                                    )}
                                    {socialProvidersNode}
                                    {/* {displayInfo && (
                                        <div id="kc-info" className={kcClsx("kcSignUpClass")}> 
                                            <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}> 
                                                {infoNode}
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-copyright text-[clamp(10px,1.5vw,14px)] text-center mt-4">© 2025 AgroSphere. All rights reserved.</div>
                </div>
            </div>
        </div>
    );
}
