import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    typescript: {
        reactDocgen: false
    },
    staticDirs: ["../public"],
    viteFinal: async config => {
        // Add alias for shared library
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                "@@agrosphere/shared": "../../libs/shared/src/index.ts"
            };
        }

        // Ensure proper TypeScript handling
        if (config.esbuild) {
            config.esbuild.jsx = "automatic";
        }

        return config;
    }
};
export default config;
