import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import svgr from "vite-plugin-svgr";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
        svgr(),
        keycloakify({
            accountThemeImplementation: "none"
        }),
        // Plugin to actively replace __dirname in bundled code
        {
            name: "replace-dirname-filename",
            enforce: "post",
            transform(code, id) {
                // Process all JS files
                if (!/\.(js|ts|jsx|tsx|mjs|cjs)$/.test(id)) {
                    return null;
                }

                // Replace __dirname and __filename
                if (code.includes("__dirname") || code.includes("__filename")) {
                    return {
                        code: code
                            .replace(/\b__dirname\b/g, '""')
                            .replace(/\b__filename\b/g, '""'),
                        map: null
                    };
                }

                return null;
            },
            renderChunk(code, chunk, options) {
                // Critical: Replace in rendered chunks (this is where CommonJS code lands)
                if (code.includes("__dirname") || code.includes("__filename")) {
                    return {
                        code: code
                            .replace(/\b__dirname\b/g, '""')
                            .replace(/\b__filename\b/g, '""'),
                        map: null
                    };
                }
                return null;
            },
            generateBundle(options, bundle) {
                // Final safety pass: ensure no __dirname remains
                Object.keys(bundle).forEach(fileName => {
                    const chunk = bundle[fileName];
                    if (chunk.type === "chunk" && chunk.code) {
                        if (
                            chunk.code.includes("__dirname") ||
                            chunk.code.includes("__filename")
                        ) {
                            chunk.code = chunk.code
                                .replace(/\b__dirname\b/g, '""')
                                .replace(/\b__filename\b/g, '""');
                        }
                    }
                });
            }
        }
    ],
    resolve: {
        alias: [
            {
                find: "@@agrosphere/shared",
                replacement: path.resolve(__dirname, "../../libs/shared/src/index.ts")
            },
            {
                find: "@@agrosphere/shared/",
                replacement: path.resolve(__dirname, "../../libs/shared/src/")
            }
        ]
    },
    optimizeDeps: {
        include: [
            "@@agrosphere/shared",
            "react",
            "react-dom",
            "@radix-ui/react-slot",
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
        ],
        exclude: [
            // Exclude next-auth and next/server to prevent __dirname issues
            "next-auth",
            "next/server",
            "next-auth/react",
            "next-auth/jwt",
            "next-auth/providers"
        ],
        esbuildOptions: {
            define: {
                __dirname: '""',
                __filename: '""',
                global: "globalThis"
            },
            plugins: [
                {
                    name: "replace-dirname-in-deps",
                    setup(build) {
                        build.onLoad({ filter: /.*/ }, async args => {
                            if (
                                args.path.includes("next-auth") ||
                                args.path.includes("next/server")
                            ) {
                                return null; // Skip these problematic modules
                            }
                            return null;
                        });
                    }
                }
            ]
        }
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true,
            esmExternals: true
        },
        rollupOptions: {
            external: id => {
                // Prevent bundling Node.js built-ins
                if (id.startsWith("node:")) return true;
                // External next-auth/server dependencies that use __dirname
                if (id.includes("next-auth")) return true;
                if (id.includes("next/server")) return true;
                return false;
            },
            output: {
                // Add banner to each chunk to define __dirname if missing
                banner: `(function() { if (typeof __dirname === 'undefined') { var __dirname = ''; } if (typeof __filename === 'undefined') { var __filename = ''; } })();`,
                // Also add intro to ensure __dirname exists
                intro: `var __dirname = ''; var __filename = '';`
            },
            plugins: [
                // Additional Rollup plugin to catch __dirname
                {
                    name: "rollup-replace-dirname",
                    transform(code, id) {
                        if (code.includes("__dirname") || code.includes("__filename")) {
                            return {
                                code: code
                                    .replace(/\b__dirname\b/g, '""')
                                    .replace(/\b__filename\b/g, '""'),
                                map: null
                            };
                        }
                        return null;
                    },
                    renderChunk(code, chunk) {
                        // Aggressively replace in all chunks
                        let modified = false;
                        let newCode = code;

                        if (code.includes("__dirname")) {
                            newCode = newCode.replace(/\b__dirname\b/g, '""');
                            modified = true;
                        }

                        if (code.includes("__filename")) {
                            newCode = newCode.replace(/\b__filename\b/g, '""');
                            modified = true;
                        }

                        if (modified) {
                            return {
                                code: newCode,
                                map: null
                            };
                        }

                        return null;
                    }
                }
            ]
        }
    },
    server: {
        fs: {
            allow: [".."]
        }
    },
    define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
        // Replace __dirname with empty string in browser builds
        __dirname: '""',
        __filename: '""',
        // Ensure process exists but is minimal
        process: JSON.stringify({ env: {} })
    }
});
