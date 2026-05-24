import type { Meta, StoryObj } from "@storybook/react";
import { UrlDemo } from "./UrlDemo";

const meta: Meta<typeof UrlDemo> = {
    title: "login/UrlDemo",
    component: UrlDemo,
    parameters: {
        layout: "fullscreen"
    },
    tags: ["autodocs"]
} satisfies Meta<typeof UrlDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <UrlDemo />
};

export const WithCustomClass: Story = {
    render: () => <UrlDemo className="max-w-4xl mx-auto" />
};
