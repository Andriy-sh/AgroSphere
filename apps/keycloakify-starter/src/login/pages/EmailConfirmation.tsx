import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useState } from "react";
import { EmailStep } from "../components/registerform/steps/EmailStep";

export default function EmailConfirmation(props: PageProps<Extract<KcContext, { pageId: "email-confirmation.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { auth, messagesPerField } = kcContext;

    const [email, setEmail] = useState(auth?.attemptedUsername ?? "");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleEmailNext = () => {
        const form = document.getElementById("kc-email-confirmation-form") as HTMLFormElement;
        if (form) {
            form.submit();
        }
    };



    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={false}
            displayMessage={!messagesPerField.existsError("email")}
            headerNode="Email Confirmation"
        >
                <EmailStep
                    email={email}
                    onEmailChange={setEmail}
                    onNext={handleEmailNext}
                    error={errors.email || (messagesPerField.existsError("email") ? messagesPerField.get("email") : undefined)}
                    setErrors={setErrors}
                    kcClsx={kcClsx}
                />
        </Template>
    );
}
