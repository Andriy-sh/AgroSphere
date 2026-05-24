import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";
import { useEffect } from "react";

const { KcPageStory } = createKcPageStory({ pageId: "invite-org-expired.ftl" });

const meta = {
    title: "login/invite-org-expired.ftl",
    component: KcPageStory,
    parameters: {
        layout: "fullscreen",
        viewport: {
            defaultViewport: "desktop"
        }
    }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithFarmerEmail: Story = {
    render: () => {
        useEffect(() => {
            const farmerInviteUrl = new URL(window.location.href);
            farmerInviteUrl.searchParams.set("role", "farmer");
            farmerInviteUrl.searchParams.set("organization", "Green Valley Farm");
            farmerInviteUrl.searchParams.set("inviterName", "Mike Smith");
            farmerInviteUrl.searchParams.set("email", "mike.smith@example.com");

            window.history.pushState({}, "", farmerInviteUrl.toString());
        }, []);

        return (
            <KcPageStory
                kcContext={{
                    url: {
                        loginUrl: "/login",
                        loginAction: "/login?action",
                        loginRestartFlowUrl: "/login?restart=true"
                    }
                }}
            />
        );
    }
};

export const WithAdvisorEmail: Story = {
    render: () => {
        useEffect(() => {
            const advisorInviteUrl = new URL(window.location.href);
            advisorInviteUrl.searchParams.set("role", "advisor");
            advisorInviteUrl.searchParams.set("organization", "Tech Solutions Inc.");
            advisorInviteUrl.searchParams.set("inviterName", "Jane Cooper");
            advisorInviteUrl.searchParams.set("email", "jane.cooper@example.com");

            window.history.pushState({}, "", advisorInviteUrl.toString());
        }, []);

        return (
            <KcPageStory
                kcContext={{
                    url: {
                        loginUrl: "/login",
                        loginAction: "/login?action",
                        loginRestartFlowUrl: "/login?restart=true"
                    }
                }}
            />
        );
    }
};

export const WithContractorEmail: Story = {
    render: () => {
        useEffect(() => {
            const contractorInviteUrl = new URL(window.location.href);
            contractorInviteUrl.searchParams.set("role", "contractor");
            contractorInviteUrl.searchParams.set("organization", "Farm Services Co.");
            contractorInviteUrl.searchParams.set("inviterName", "Diana Vint");
            contractorInviteUrl.searchParams.set("email", "diana.vint@example.com");

            window.history.pushState({}, "", contractorInviteUrl.toString());
        }, []);

        return (
            <KcPageStory
                kcContext={{
                    url: {
                        loginUrl: "/login",
                        loginAction: "/login?action",
                        loginRestartFlowUrl: "/login?restart=true"
                    }
                }}
            />
        );
    }
};
