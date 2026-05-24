import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import svgr from "vite-plugin-svgr";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
        svgr(),
        keycloakify({
            accountThemeImplementation: "none"
        })
    ],
    resolve: {
        alias: [
            {
                find: "@agrosphere/shared",
                replacement: path.resolve(__dirname, "../../libs/shared/src/index.ts")
            },
            {
                find: "@agrosphere/shared/",
                replacement: path.resolve(__dirname, "../../libs/shared/src/")
            }
        ]
    },
    optimizeDeps: {
        include: [
            "@agrosphere/shared",
            "react",
            "react-dom",
            "@radix-ui/react-slot",
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
        ],
        exclude: []
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/]
        }
    },
    server: {
        fs: {
            allow: [".."]
        }
    },
    define: {
        "process.env.NODE_ENV": '"development"'
    }
});
