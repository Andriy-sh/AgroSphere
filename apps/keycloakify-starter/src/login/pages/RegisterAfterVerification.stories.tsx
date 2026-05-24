import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";
import { useEffect } from "react";

const { KcPageStory } = createKcPageStory({ pageId: "register-after-verification.ftl" });

const meta = {
    title: "login/register-after-verification.ftl",
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

export const WithEmailFromUrl: Story = {
    render: () => {
        useEffect(() => {
            const url = new URL(window.location.href);
            url.searchParams.set("email", "john.doe@example.com");
            window.history.replaceState({}, "", url.toString());
        }, []);

        return (
            <KcPageStory
                kcContext={{
                    url: {
                        loginUrl: "/login",
                        loginAction: "/login?action",
                        loginRestartFlowUrl: "/login?restart=true"
                    },
                    realm: {
                        displayName: "LiveFarm",
                        registrationEmailAsUsername: true
                    },
                    auth: {
                        showUsername: false
                    },
                    messagesPerField: {
                        exists: () => false
                    }
                }}
            />
        );
    }
};
