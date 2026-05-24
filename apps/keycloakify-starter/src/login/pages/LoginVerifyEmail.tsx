import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg } = i18n;

    const { url } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            headerNode={msg("emailVerifyTitle")}
            infoNode={
                <p className="instruction">
                    {msg("emailVerifyInstruction2")}
                    <br />
                    <a href={url.loginAction}>{msg("doClickHere")}</a>
                    &nbsp;
                    {msg("emailVerifyInstruction3")}
                </p>
            }
        >
            <button
                type="button"
                className="w-full bg-[#EEF0F6] text-[#818D99] !text-sm border-none rounded-lg py-2 cursor-pointer !mt-4"
                onClick={() => {
                    window.location.href = "/";
                }}
            >
                Cancel
            </button>
            <div className="flex justify-center items-center w-full mt-4 !text-sm !text-[#101010]">
                Didn’t get the email? &nbsp;
                <span className="text-[#29B54C] !text-sm !font-medium">Resend it</span>
            </div>
            {/* <p className="instruction">{msg("emailVerifyInstruction1", user?.email ?? "")}</p> */}
        </Template>
    );
}
