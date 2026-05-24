import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "email-confirmation.ftl" });

const meta = {
    title: "login/email-confirmation.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm: {
                    registrationEmailAsUsername: true
                },
                url: {
                    loginAction: "/email-confirmation",
                    loginUrl: "/login"
                },
                auth: {
                    attemptedUsername: ""
                }
            }}
        />
    )
};

export const WithAttemptedUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                realm: {
                    registrationEmailAsUsername: true
                },
                url: {
                    loginAction: "/email-confirmation",
                    loginUrl: "/login"
                },
                auth: {
                    attemptedUsername: "test@example.com"
                }
            }}
        />
    )
};
