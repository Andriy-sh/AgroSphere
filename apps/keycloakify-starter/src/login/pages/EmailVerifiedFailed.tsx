import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function EmailVerifiedFailed(props: PageProps<Extract<KcContext, { pageId: "mail-verf-fail.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={"Email verification failed!"}
            infoNode={
                <p className="text-gray-600 text-center ">
                    We couldn&apos;t verify your email. The link may have expired or is invalid.
                    <br />
                    Please try again or request a new verification link.
                </p>
            }
        >
            <div className="flex flex-col items-center w-full mt-4">
                <button
                    className="w-full max-w-[400px] bg-[#29B54C] !text-white rounded-lg py-2 !text-sm font-medium hover:bg-[#22a143] transition"
                    type="button"
                    onClick={() => {
                        window.location.href = "/";
                    }}
                >
                    Try again
                </button>
            </div>
        </Template>
    );
}
