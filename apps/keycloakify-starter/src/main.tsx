import "material-symbols";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";
// Polyfill __dirname and __filename for browser environment
// This prevents errors from dependencies that use Node.js globals
if (typeof window !== "undefined") {
    // @ts-ignore - Define __dirname as empty string for browser
    if (typeof window.__dirname === "undefined") {
        // @ts-ignore
        window.__dirname = "";
    }
    // @ts-ignore - Define __filename as empty string for browser
    if (typeof window.__filename === "undefined") {
        // @ts-ignore
        window.__filename = "";
    }
    // Also define in global scope (some dependencies might check global)
    if (typeof globalThis.__dirname === "undefined") {
        // @ts-ignore
        globalThis.__dirname = "";
    }
    if (typeof globalThis.__filename === "undefined") {
        // @ts-ignore
        globalThis.__filename = "";
    }
}

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase
/*
import { getKcContextMock } from "./login/KcPageStory";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "register.ftl",
        overrides: {}
    });
}
*/

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {!window.kcContext ? (
            <h1>No Keycloak Context</h1>
        ) : (
            <KcPage kcContext={window.kcContext} />
        )}
    </StrictMode>
);
