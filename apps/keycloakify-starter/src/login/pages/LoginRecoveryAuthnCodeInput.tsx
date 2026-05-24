import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import React, { useState, useEffect, useRef } from "react";
import { OTPInput } from "../components/OTPInput";
import { z } from "zod";

const otpSchema = z.array(z.string().regex(/^\d$/)).length(4);

export default function LoginRecoveryAuthnCodeInput(props: PageProps<Extract<KcContext, { pageId: "login-recovery-authn-code-input.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, messagesPerField } = kcContext;
    const { msg } = i18n;

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [timer, setTimer] = useState(30);
    const [submitting, setSubmitting] = useState(false);
    const [resent, setResent] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (timer > 0) {
            const t = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(t);
        }
        return undefined;
    }, [timer]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);
        const result = otpSchema.safeParse(otp);
        if (!result.success) {
            setError("Please enter a valid 4-digit code");
            return;
        }
        if (otp.join("") !== "1234") {
            setError("The verification code you entered is incorrect. Request a new verification code if needed.");
            return;
        }
        setSubmitting(true);
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const handleResend = () => {
        setOtp(["", "", "", ""]);
        setError(undefined);
        setTimer(30);
        setResent(true);
        setTimeout(() => setResent(false), 2000);
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("auth-recovery-code-header")}
            displayMessage={!messagesPerField.existsError("recoveryCodeInput")}
        >
            <form
                ref={formRef}
                id="kc-recovery-code-login-form"
                className={kcClsx("kcFormClass") + "flex flex-col items-center w-full !mx-0 !px-0"}
                action={url.loginAction}
                method="post"
                onSubmit={handleSubmit}
                autoComplete="off"
            >
                <OTPInput value={otp} onChange={setOtp} error={error} disabled={submitting} autoFocus timer={timer === 0 ? undefined : timer} />
                {timer === 0 && (
                    <button
                        type="button"
                        className="text-[#29B54C] text-sm font-semibold mt-2 mb-2 hover:underline focus:outline-none text-center w-full"
                        onClick={() => {
                            handleResend();
                            alert("A new code has been sent!");
                        }}
                        disabled={resent}
                    >
                        {error && error.includes("incorrect") ? "Request new code" : resent ? "Code sent!" : "Resend code"}
                    </button>
                )}
                <input type="hidden" name="recoveryCodeInput" value={otp.join("")} />
                <div className={kcClsx("kcFormGroupClass") + " flex flex-row gap-4 w-full "}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsWrapperClass")}></div>
                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass") + " flex flex-row !mx-0 !gap-2 !w-full"}>
                        <button
                            type="button"
                            className="flex-1 rounded-lg py-2 text-sm font-normal bg-[#F1F3F9] text-gray-500 hover:bg-gray-200 transition min-w-[120px]"
                            disabled={submitting}
                            onClick={() => setOtp(["", "", "", ""])}
                        >
                            Cancel
                        </button>
                        <button
                            className={
                                "flex-1 rounded-lg py-2 text-sm font-normal bg-[#29B54C] !text-white hover:bg-[#22a143] transition min-w-[120px]"
                            }
                            name="login"
                            id="kc-login"
                            type="submit"
                            disabled={submitting}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </Template>
    );
}
