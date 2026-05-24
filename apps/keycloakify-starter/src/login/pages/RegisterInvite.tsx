import type { JSX } from "keycloakify/tools/JSX";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { RegisterForm } from "../components/registerform/RegisterForm";
import { getRoleFromUrl, getOrganizationFromUrl } from "../utils/url-params";
import { getCurrentInviteParams, validateInviteParams } from "../utils/invite-urls";

type RegisterInviteProps = PageProps<Extract<KcContext, { pageId: "invite-register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function RegisterInvite(props: RegisterInviteProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg } = i18n;

    const registerContext = {
        ...kcContext,
        pageId: "invite-register.ftl" as const,
        termsAcceptanceRequired: true
    };

    const prefillRole = getRoleFromUrl();
    const prefillOrganization = getOrganizationFromUrl();

    const inviteParams = getCurrentInviteParams();

    if (inviteParams && !validateInviteParams(inviteParams)) {
        return;
    }

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("registerTitle")}
            displayMessage={kcContext.messagesPerField.exists("global")}
            displayRequiredFields
        >
            <RegisterForm
                kcContext={registerContext as unknown as Extract<KcContext, { pageId: "register.ftl" }>}
                i18n={i18n}
                doUseDefaultCss={doUseDefaultCss}
                classes={classes}
                UserProfileFormFields={props.UserProfileFormFields}
                doMakeUserConfirmPassword={props.doMakeUserConfirmPassword}
                showRoleSelection={false}
                prefillRole={prefillRole}
                prefillOrganization={prefillOrganization}
            />
        </Template>
    );
}
