import type { JSX } from "keycloakify/tools/JSX";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { RegisterAfterVerificationForm } from "../components/registerform/RegisterAfterVerificationForm";

type RegisterAfterVerificationProps = PageProps<Extract<KcContext, { pageId: "register-after-verification.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function RegisterAfterVerification(props: RegisterAfterVerificationProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const handleFormComplete = (data: {
        firstName: string;
        lastName: string;
        password: string;
        userType: string;
        businessName: string;
        businessType: string;
        businessCategory: string;
        farmCategory: string;
        termsAccepted: boolean;
    }) => {

        if (!data.termsAccepted) {
            return;
        }

        window.location.href = "/dashboard";
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode="Complete Your Registration"
            displayMessage={kcContext.messagesPerField.exists("global")}
            displayRequiredFields
        >
            <RegisterAfterVerificationForm kcClsx={kcClsx} messagesPerField={kcContext.messagesPerField} onComplete={handleFormComplete} />
        </Template>
    );
}
