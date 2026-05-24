import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { getCurrentInviteParams, createRegistrationUrlFromInvite } from "../utils/invite-urls";

interface InviteOrganisationCardProps {
    onSignIn?: () => void;
}

export default function InviteOrganisationCard(
    props: PageProps<Extract<KcContext, { pageId: "invite-org.ftl" }>, I18n> & InviteOrganisationCardProps
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, onSignIn } = props;

    const inviteParams = getCurrentInviteParams();

    if (!inviteParams) {
        return (
            <Template
                kcContext={kcContext}
                i18n={i18n}
                doUseDefaultCss={doUseDefaultCss}
                classes={classes}
                headerNode={"Invalid Invite"}
                infoNode={
                    <span className="text-red-600">
                        This invite link is invalid or has expired. Please contact the person who sent you this invite.
                    </span>
                }
            >
                <div className="flex flex-col items-center w-full">
                    <button className="w-full bg-gray-400 !text-white rounded-lg py-2 !text-sm font-medium cursor-not-allowed !mb-4" disabled>
                        Invalid Invite
                    </button>
                    <div className="text-center text-sm text-[#101010]">
                        Already have an account?{" "}
                        <button type="button" className="!text-[#29B54C] font-medium hover:underline ml-1" onClick={onSignIn}>
                            Sign in
                        </button>
                    </div>
                </div>
            </Template>
        );
    }

    const { inviterName, email, organization } = inviteParams;

    const handleSignUp = () => {
        const registrationUrl = createRegistrationUrlFromInvite(inviteParams);
        window.location.href = registrationUrl;
    };

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={"Welcome!"}>
            <div className="flex flex-col items-center w-full !text-sm text-center ">
                <span className="mb-4">
                    {inviterName} (
                    <a href={`mailto:${email}`} className="!text-[#29B54C] !font-medium">
                        {email}
                    </a>
                    ) has invited you
                    <br />
                    to join their <span className="font-medium">{organization}</span> team in LiveFarm.
                </span>
                <button
                    className="w-full bg-[#29B54C] !text-white rounded-lg py-2 !text-sm font-medium hover:bg-[#22a143] transition !mb-4"
                    onClick={handleSignUp}
                >
                    Sign up
                </button>
                <div className="text-center text-sm text-[#101010]">
                    Already have an account?{" "}
                    <button type="button" className="!text-[#29B54C] font-medium hover:underline ml-1" onClick={onSignIn}>
                        Sign in
                    </button>
                </div>
            </div>
        </Template>
    );
}
