import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "invite-register.ftl" });

const meta = {
    title: "login/invite-register.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithAdvisorRole: Story = {
    render: () => <KcPageStory />,
    parameters: {
        nextjs: {
            router: {
                query: { role: "advisor" }
            }
        }
    }
};

export const WithAdvisorRoleAndOrganization: Story = {
    render: () => <KcPageStory />,
    parameters: {
        nextjs: {
            router: {
                query: {
                    role: "advisor",
                    organization: "Tech Solutions Inc."
                }
            }
        }
    }
};

export const WithContractorRole: Story = {
    render: () => <KcPageStory />,
    parameters: {
        nextjs: {
            router: {
                query: { role: "contractor" }
            }
        }
    }
};

export const WithContractorRoleAndOrganization: Story = {
    render: () => <KcPageStory />,
    parameters: {
        nextjs: {
            router: {
                query: {
                    role: "contractor",
                    organization: "Farm Services Co."
                }
            }
        }
    }
};

export const WithFarmerRole: Story = {
    render: () => <KcPageStory />,
    parameters: {
        nextjs: {
            router: {
                query: { role: "farmer" }
            }
        }
    }
};

export const WithFarmerRoleAndOrganization: Story = {
    render: () => <KcPageStory />,
    parameters: {
        nextjs: {
            router: {
                query: {
                    role: "farmer",
                    organization: "Green Valley Farm"
                }
            }
        }
    }
};
