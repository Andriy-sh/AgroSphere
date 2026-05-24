import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login.ftl" });

const meta = {
    title: "login/login.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                auth: { showUsername: true },
                realm: {
                    rememberMe: true,
                    displayName: "Test",
                    loginWithEmailAllowed: true,
                    registrationAllowed: false,
                    resetPasswordAllowed: true,
                    password: true,
                    registrationEmailAsUsername: true
                },
                url: {
                    loginResetCredentialsUrl: "/forgot-password",
                    loginUrl: "/login",
                    loginAction: "/perform-login"
                }
            }}
        />
    )
};
