import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { mockOrganizations } from "../mock/organizations";


export default function OrganizationSelection(props: PageProps<Extract<KcContext, { pageId: "organization-selection.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const organizations = mockOrganizations;

    const currentEmail = "john.doe@agency.inc";

    const handleOrganizationSelect = (organizationId: string) => {
        document.cookie = `selectedOrganizationId=${organizationId}; path=/; max-age=86400`;

        const selectedOrg = organizations.find(org => org.id === organizationId);
        if (selectedOrg) {
            document.cookie = `selectedOrganizationName=${encodeURIComponent(selectedOrg.name)}; path=/; max-age=86400`;
            document.cookie = `selectedOrganizationRole=${encodeURIComponent(selectedOrg.role)}; path=/; max-age=86400`;
        }

        window.location.href = "/dashboard";
    };

    const handleUseDifferentEmail = () => {
        document.cookie = "selectedOrganizationId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "selectedOrganizationName=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "selectedOrganizationRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        window.location.href = "/login";
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={"Select an organisation to continue"}
        >
            <div className="flex flex-col w-full space-y-4 !mt-6">
                <div className="space-y-3 max-h-70 overflow-y-auto">
                    {organizations.map(org => (
                        <div
                            key={org.id}
                            className="flex items-center justify-between p-4 border !border-[#EEF0F6] rounded-xl bg-white hover:border-[#29B54C] hover:shadow-sm cursor-pointer transition-all duration-150"
                            onClick={() => handleOrganizationSelect(org.id)}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="!w-12 !h-12 bg-[#00AF4D1F] !rounded-lg flex items-center justify-center transition-colors duration-150 ">
                                    <span className="text-green-600 font-semibold text-sm transition-colors duration-150">{org.initials}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="!text-sm !font-medium text-[#101010]">{org.name}</span>
                                    <span className="!text-xs text-[#818D99]">{org.email}</span>
                                </div>
                            </div>
                            <div className="bg-[#EEF0F6] px-3 py-1 !rounded-sm">
                                <span className="text-sm text-[#101010] font-medium">{org.role}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center space-y-2">
                    <p className="!text-sm !text-[#101010]">
                        The email you are currently logged into is <span className="font-medium">{currentEmail}</span>
                    </p>
                    <button type="button" className="!text-sm !text-[#29B54C] !font-medium  hover:underline" onClick={handleUseDifferentEmail}>
                        Use a different email
                    </button>
                </div>
            </div>
        </Template>
    );
}
