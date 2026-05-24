import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { getCurrentInviteParams } from "../utils/invite-urls";

export default function InviteOrganisationCardExpired(props: PageProps<Extract<KcContext, { pageId: "invite-org-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const inviteParams = getCurrentInviteParams();
    const email = inviteParams?.email || "anna@greenmark.io";

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={"Invitation link expired!"}>
            <div className="flex flex-col items-center w-full">
                <p className="!text-[#101010] !text-center !text-sm !mb-8">
                    This invitation link is no longer valid. Please contact the person who invited you —{" "}
                    <a href={`mailto:${email}`} className="!text-[#29B54C] !font-medium">
                        {email}
                    </a>{" "}
                    — to request a new link.
                </p>
                <button
                    className="w-full max-w-[400px] bg-[#29B54C] !text-white rounded-lg py-2 !text-sm font-medium hover:bg-[#22a143] transition"
                    type="button"
                    onClick={() => {
                        window.location.href = "/login";
                    }}
                >
                    Go to sign in
                </button>
            </div>
        </Template>
    );
}
